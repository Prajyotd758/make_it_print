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
      "Make It Print does not accept ordinary product returns. Every product is manufactured individually, with 3D printing, custom design, hand finishing, post-processing, assembly and special packaging. Replacement is available only for specific eligible issues, after verification.",
    sections: [
      {
        h: "No General Returns",
        p: "We do not accept returns or change-of-mind refunds for:",
        items: [
          "Change of mind or personal preference",
          "Wrong colour, size or quantity selected by the customer",
          "Minor surface variations, layer lines or finishing differences",
          "Minor colour differences",
          "Errors in customer-provided or customer-approved designs",
        ],
      },
      {
        h: "Custom-Made Products",
        p: "Products made specifically for a customer are not eligible for ordinary return. This includes:",
        items: [
          "Customized gifts, personalized products and nameplates",
          "Keychains, miniatures, custom figurines and logo products",
          "Engineering components and prototypes",
          "Products made from customer-provided STL, STEP, OBJ, 3MF or other files",
        ],
      },
      {
        h: "When a Replacement May Be Available",
        p: "A replacement may be considered, after verification, where the issue is caused by:",
        items: [
          "A significant manufacturing defect",
          "Wrong product supplied by Make It Print",
          "Significant shipping damage",
          "A missing component",
          "A product materially different from the confirmed order",
        ],
        note: "A replacement is generally provided instead of a refund, and may be reprinted, re-manufactured, re-finished or reassembled depending on the issue.",
      },
      {
        h: "Unboxing Video Is Required",
        p: "For any claim involving damage, missing items or an incorrect product, you must provide a continuous, uncut video of the package being opened. It should start before opening and show:",
        items: [
          "The sealed package and shipping label",
          "The condition of the outer package",
          "The opening and the internal packaging",
          "The product and the reported issue",
        ],
        note: "The video must not contain cuts, edits, missing sections, re-arranged footage or unexplained gaps.",
      },
      {
        h: "Why We Require It",
        p: "Every order goes through manufacturing, quality check, finishing, final inspection and protective packaging before dispatch. The video is the evidence that shows:",
        items: [
          "Whether the outer package was damaged before opening",
          "The condition of the internal packaging and product",
          "Whether all components were present",
          "Whether damage happened in transit or after delivery",
        ],
        note: "Without a continuous, uncut video, a replacement request for damage, missing items or incorrect products may be declined, as the condition at opening cannot be verified. This does not exclude any remedy that applicable law requires to remain available.",
      },
      {
        h: "Reporting Time & Evidence",
        p: "Report issues as soon as possible after delivery, preferably within 24–48 hours. We may ask for:",
        items: [
          "Order number",
          "Uncut unboxing video",
          "Photographs of the product, outer and internal packaging",
          "Shipping label",
          "Product measurements and a description of the issue",
        ],
        note: "Keep the product, box, shipping label and protective materials until your claim is resolved. They may be needed for investigation or a courier claim.",
      },
      {
        h: "Damage After Delivery",
        p: "Replacement is generally not available for damage caused by:",
        items: [
          "Dropping or improper handling",
          "Incorrect assembly or excessive force",
          "Heat or chemical exposure",
          "Modification, cutting or drilling",
          "Improper installation, storage or misuse",
        ],
      },
      {
        h: "Normal 3D Printing Characteristics",
        p: "The following are part of additive manufacturing and do not automatically qualify for replacement:",
        items: [
          "Layer lines and minor support marks",
          "Minor surface texture differences",
          "Minor dimensional variations",
          "Small finishing, colour or seam variations",
        ],
        note: "Where a specific tolerance, finish or appearance was agreed in writing, the agreed specification applies.",
      },
      {
        h: "Customer-Approved Designs",
        p: "If you approve a design, preview, drawing or specification before manufacturing, the product is made to the approved version. Replacement may not be available for errors present in the information you supplied or approved.",
      },
      {
        h: "Replacement Shipping & Final Assessment",
        p: "Where the issue is confirmed to be ours, we decide the replacement shipping arrangements. Where it is caused by the customer, additional manufacturing or shipping charges may apply. Every claim is reviewed individually based on:",
        items: [
          "Order specifications and customer communication",
          "Product type and manufacturing process",
          "Evidence provided, including the unboxing video",
          "Packaging condition and nature of the issue",
        ],
        note: "Make It Print reserves the right to reject claims that do not meet this policy, subject to applicable consumer rights and law.",
      },
    ],
  },
  refund: {
    label: "Refund & Exchange",
    tag: "Refunds",
    title: "Refund & Exchange Policy",
    intro:
      "Because every product is made individually and often to your specification, orders are generally final once production has started. Where an order qualifies under our Return Policy, we generally provide a replacement rather than a refund, subject to applicable consumer laws.",
    sections: [
      {
        h: "Unboxing Video – Required for Claims",
        p: "For damaged, missing or incorrect items, record one continuous, uncut video:",
        items: [
          "Start with the sealed package and shipping label",
          "Show the complete opening without cuts or interruptions",
          "Clearly capture the product and the damage or missing components",
        ],
        note: "Without this video, we may decline the replacement request.",
      },
      {
        h: "Damaged or Defective Products",
        p: "Contact us as soon as possible, preferably within 24–48 hours of delivery, with:",
        items: [
          "Your order details",
          "Clear photographs of the product",
          "Your complete unboxing video",
          "A description of the issue",
        ],
        note: "After verification, we decide the resolution, which will normally be a replacement.",
      },
      {
        h: "Not Eligible",
        p: "Exchanges and refunds are not available for change of mind, wrong customization details, minor print characteristics, or damage after delivery. Please verify names, dimensions, colours and designs before confirming your order.",
      },
    ],
  },
  shipping: {
    label: "Shipping Policy",
    tag: "Shipping",
    title: "Shipping Policy",
    intro:
      "We manufacture, finish and pack every order with care, then ship it across India through trusted courier partners.",
    sections: [
      {
        h: "Processing Time",
        p: "Each product is made to order, so processing time depends on:",
        items: [
          "Product type, size and quantity",
          "Customization and design approval",
          "Printing, post-processing, painting and assembly required",
          "Current order volume",
        ],
        note: "Estimated production time is shared at the time of order or quotation. Orders are dispatched after quality check and packaging.",
      },
      {
        h: "Delivery Coverage & Time",
        p: "We ship all over India. Delivery time depends on your location and the courier service, and starts once the order is dispatched. Delivery dates are estimates, not guarantees.",
      },
      {
        h: "Shipping Charges",
        p: "Shipping charges, where applicable, are calculated based on weight, size and destination, and are shown at checkout or in your quotation before payment.",
      },
      {
        h: "Tracking",
        p: "Once your order is dispatched, tracking details are shared by email, SMS or WhatsApp, using the contact details you provided.",
      },
      {
        h: "Address & Contact Accuracy",
        p: "Please provide a complete and correct shipping address and a working mobile number. We are not responsible for delays or failed delivery caused by:",
        items: [
          "Incorrect or incomplete address",
          "Unreachable phone number",
          "Refusal to accept delivery",
          "Repeated unavailability at the delivery address",
        ],
        note: "Re-shipping or return-to-origin charges may apply in such cases.",
      },
      {
        h: "Packaging",
        p: "Products are packed with protective materials to reduce the risk of transit damage. Please record an uncut unboxing video when opening your package, as described in our Return Policy.",
      },
      {
        h: "Delays",
        p: "Delays can occur due to courier issues, weather, public holidays, regional restrictions or other circumstances beyond our control. We will help follow up with the courier where possible.",
      },
      {
        h: "Damaged or Missing Shipments",
        p: "If your package arrives damaged or incomplete, report it as soon as possible, preferably within 24–48 hours, and keep all packaging. Claims are handled under our Return Policy and require the continuous, uncut unboxing video.",
      },
    ],
  },
  privacy: {
    label: "Privacy Policy",
    tag: "Privacy",
    title: "Privacy Policy",
    intro:
      "Make It Print respects your privacy and handles customer information responsibly. This policy explains what we collect, why, how we use it and how we protect it. We aim to align with applicable Indian data-protection requirements, including the Digital Personal Data Protection Act, 2023 and its Rules.",
    sections: [
      {
        h: "Information We Collect",
        p: "Depending on how you interact with us, we may collect:",
        items: [
          "Personal details: name, mobile number, email, billing and shipping address, company name, GST details where applicable",
          "Order details: products, quantity, order value, payment status, shipping details, communication",
          "Design files: STL, STEP, OBJ, 3MF, CAD models, drawings, images, dimensions and technical information",
        ],
      },
      {
        h: "How We Use Your Information",
        p: "We use information to:",
        items: [
          "Process orders and prepare quotations",
          "Provide 3D printing, CAD and design services",
          "Manufacture and deliver products",
          "Process payments, refunds and replacements",
          "Provide customer support and communicate about orders",
          "Maintain accounting records and meet tax or legal requirements",
          "Improve our products and services",
          "Prevent fraud or misuse and resolve disputes",
        ],
      },
      {
        h: "Customer Design Files",
        p: "Files you provide may be stored for manufacturing, quality checking, reprinting, support, order records and future reference where appropriate. We will not intentionally publish confidential customer designs without permission, unless required by law.",
        note: "For highly confidential industrial designs, you may request an NDA or other confidentiality arrangement before sharing sensitive information.",
      },
      {
        h: "Sharing Information",
        p: "We share only what is reasonably necessary with service providers such as:",
        items: [
          "Courier companies",
          "Payment gateways",
          "Website hosting and IT providers",
          "Accounting and tax professionals",
          "Manufacturing partners, where required to fulfil an order",
        ],
      },
      {
        h: "Payment Information",
        p: "Payments are processed through third-party payment gateways. Where the provider handles them, we do not store complete card details, banking credentials or other sensitive payment credentials. Please review the payment provider's own privacy and security policies.",
      },
      {
        h: "Website Data & Cookies",
        p: "Our website may collect your IP address, browser and device information, pages visited and interactions, and may use cookies to:",
        items: [
          "Keep the website working and secure",
          "Remember your preferences",
          "Understand usage and improve performance",
        ],
        note: "You can control cookies through your browser settings. Disabling some cookies may affect website functionality.",
      },
      {
        h: "Data Security & Retention",
        p: "We take reasonable steps to protect your information from unauthorized access, misuse, loss or disclosure, but no online system is completely secure. Please avoid sending unnecessary sensitive information over unsecured channels. We keep information only as long as reasonably necessary for order fulfilment, support, accounting, tax, legal compliance, warranty or return matters, dispute resolution and business records.",
      },
      {
        h: "Third-Party Services",
        p: "We may use third-party payment, courier, analytics, hosting, communication and marketing services. These providers may process information under their own policies and applicable laws.",
      },
      {
        h: "Your Privacy Requests",
        p: "You may contact us with questions or requests about your personal information, subject to applicable law.",
        note: "Privacy contact: [PRIVACY EMAIL]",
      },
      {
        h: "Changes to This Policy",
        p: "We may update this policy due to changes in law, services, technology or business practices. The latest version will always be published here.",
      },
    ],
  },
} satisfies Record<string, Policy>;

export type PolicyKey = keyof typeof POLICIES;
