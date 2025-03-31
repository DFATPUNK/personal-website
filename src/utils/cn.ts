// src/utils/cn.ts
export function cn(...classes: (string | false | undefined | null)[]) {
    return classes.filter(Boolean).join(" ");
  }  