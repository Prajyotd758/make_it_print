export type PolicyKey = "returns" | "refund" | "privacy" | "shipping";

export interface PolicySection {
  h: string;
  p?: string;
  items?: string[];
  note?: string;
}

export interface Policy {
  label: string;
  tag: string;
  title: string;
  intro: string;
  sections: PolicySection[];
}

export const POLICIES = {
  returns: {
    label: "Return Policy",
    tag: "Returns",
    title: "Return Policy",
    intro:
      "Because many of our products are custom-designed, personalized, or made specifically for your order, returns are handled case by case.",
    sections: [
      {
        h: "Eligibility",
        p: "For an exchange or return to be considered:",
        items: [
          "The issue must be reported within the specified time period.",
          "The product must not have been intentionally damaged, modified, or misused.",
          "All components and accessories must be returned, where applicable.",
          "The product may be inspected before a replacement or refund is approved.",
          "Return shipping arrangements will be communicated by MAKE IT PRINT based on the nature of the issue.",
        ],
      },
      {
        h: "Non-Returnable / Custom Products",
        p: "Because many of our products are custom-designed, personalized, or manufactured specifically for the customer, we generally cannot accept returns due to change of mind, incorrect personal preferences, or ordering the wrong customization details.",
        items: [
          "Please carefully verify names, dimensions, designs, and other customization details before confirming an order.",
        ],
      },
    ],
  },
  refund: {
    label: "Refund & Exchange",
    tag: "Refunds",
    title: "Refund & Exchange Policy",
    intro:
      "At MAKE IT PRINT, every product is made with care and is often custom-made or produced specifically for your order. Because of this, orders are generally considered final once production has started, subject to the terms below and applicable consumer laws.",
    sections: [
      {
        h: "Unboxing Video – Important for Your Protection",
        p: "To ensure a smooth and fair resolution if your order arrives damaged or has any issue, we strongly recommend recording a continuous video while opening your package. The video should:",
        items: [
          "Clearly show the sealed package and shipping label before opening.",
          "Show the complete unboxing process without cuts or interruptions.",
          "Clearly capture the product and any damage or missing components, if applicable.",
        ],
        note: "An unboxing video helps us verify the condition of the product at delivery and lets us process genuine damage or defect claims faster. Claims without sufficient proof may require additional verification before an exchange or refund can be approved.",
      },
      {
        h: "Exchange / Refund for Damaged or Defective Products",
        p: "If you receive a damaged or defective product, please contact us within 48 hours of delivery with:",
        items: [
          "Your order details",
          "Clear photographs of the product",
          "Your complete unboxing video",
          "A description of the issue",
        ],
        note: "After reviewing the submitted information, MAKE IT PRINT will determine the appropriate resolution, which may include an exchange, replacement, repair, or refund, depending on the nature of the issue.",
      },
    ],
  },
  privacy: {
    label: "Privacy Policy",
    tag: "Privacy",
    title: "Privacy Policy",
    intro: "",
    sections: [],
  },
  shipping: {
    label: "Shipping Policy",
    tag: "Shipping",
    title: "Shipping Policy",
    intro: "",
    sections: [],
  },
};
