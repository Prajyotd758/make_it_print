type L = () => void;
let state = { open: false, text: "" };
const subs = new Set<L>();

const set = (s: typeof state) => {
  state = s;
  subs.forEach((l) => l());
};

export const showLoader = (text = "Please wait…") => set({ open: true, text });
export const hideLoader = () => set({ open: false, text: "" });
export const subscribeLoader = (l: L) => (subs.add(l), () => void subs.delete(l));
export const getLoader = () => state;