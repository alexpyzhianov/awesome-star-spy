import { POINTER_CLASS } from "./utils";

const pointers = Array.prototype.slice.call(
    document.getElementsByClassName(POINTER_CLASS),
) as HTMLSpanElement[];

pointers.forEach((el) => el.remove());
