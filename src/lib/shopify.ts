import { toast } from "sonner";

// ============= Shopify Storefront API setup =============
export const SHOPIFY_API_VERSION = "2026-10";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "sport-xan9c62t.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "253825ab70f7b56f48eca4fbf6bb0ad3";

// ============= Types =============
export type Money = { amount: string; currencyCode: string };

export type ShopifySelectedOption = { name: string; value: string };

export type ShopifyVariant = {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
};

export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  priceRange: { minVariantPrice: Money };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
};

export function formatMoney(m: Money) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: m.currencyCode }).format(Number(m.amount));
  } catch {
    return `${m.currencyCode} ${Number(m.amount).toFixed(2)}`;
  }
}

export const WHATSAPP_URL = "https://wa.me/923000000000?text=Hi%2C%20I%20have%20a%20question";

// ============= Core request helper =============
async function storefrontApiRequest<T = unknown>(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return undefined;
  }

  if (!response.ok) throw new Error(`Shopify request failed with status ${response.status}`);

  const data = await response.json();
  if (data.errors) throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  return data as T;
}

// ============= Product queries =============
const PRODUCT_FIELDS = `
  id
  title
  description
  handle
  productType
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 8) { edges { node { url altText } } }
  variants(first: 50) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

export async function fetchProducts(first = 50, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query: query || null });
  return (data?.data?.products?.edges ?? []).map((e: { node: ShopifyProduct }) => e.node);
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.data?.product ?? null;
}

// ============= Cart mutations =============
const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

type UserError = { field: string[] | null; message: string };

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store"); // Required for checkout to work without password
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: UserError[]): boolean {
  return userErrors.some(
    (e) => e.message.toLowerCase().includes("cart not found") || e.message.toLowerCase().includes("does not exist"),
  );
}

export async function createShopifyCart(item: {
  quantity: number;
  variantId: string;
}): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });

  const userErrors: UserError[] = data?.data?.cartCreate?.userErrors ?? [];
  if (userErrors.length > 0) {
    console.error("Cart creation failed:", userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines?.edges?.[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: { quantity: number; variantId: string },
): Promise<{ success: boolean; lineId?: string; checkoutUrl?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const userErrors: UserError[] = data?.data?.cartLinesAdd?.userErrors ?? [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Add line failed:", userErrors);
    return { success: false };
  }

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges ?? [];
  const newLine = lines.find((l: { node: { id: string; merchandise: { id: string } } }) => l.node.merchandise.id === item.variantId);
  const checkoutUrl = data?.data?.cartLinesAdd?.cart?.checkoutUrl;
  return { success: true, lineId: newLine?.node?.id, checkoutUrl: checkoutUrl ? formatCheckoutUrl(checkoutUrl) : undefined };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors: UserError[] = data?.data?.cartLinesUpdate?.userErrors ?? [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Update line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors: UserError[] = data?.data?.cartLinesRemove?.userErrors ?? [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error("Remove line failed:", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function checkCartExists(cartId: string): Promise<boolean> {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  if (!data) return true; // API error (e.g. 402 billing) — preserve local cart
  const cart = data?.data?.cart;
  return Boolean(cart) && (cart?.totalQuantity ?? 0) > 0;
}
