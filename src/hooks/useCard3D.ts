import { useCallback } from "react";

const EASE = "cubic-bezier(0.4,0,0.2,1)";

export function useCard3D(intensity = 10) {
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const { left, top, width, height } = el.getBoundingClientRect();
      const rx = ((e.clientX - left) / width - 0.5) * 2;
      const ry = ((e.clientY - top) / height - 0.5) * 2;

      el.style.transform = `perspective(1000px) rotateY(${rx * intensity * 0.5}deg) rotateX(${-ry * intensity * 0.5}deg) translateY(-10px)`;
      el.style.boxShadow = "0 28px 56px -14px rgba(16,185,129,0.22), 0 0 0 1px rgba(16,185,129,0.08)";
      el.style.transition = `transform 0.12s ${EASE}`;

      const glare = el.querySelector<HTMLElement>(".card-glare");
      if (glare) {
        const gx = ((e.clientX - left) / width) * 100;
        const gy = ((e.clientY - top) / height) * 100;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14) 0%, transparent 65%)`;
        glare.style.opacity = "1";
      }
    },
    [intensity]
  );

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    el.style.boxShadow = "";
    el.style.transition = `transform 0.5s ${EASE}, box-shadow 0.5s ${EASE}`;

    const glare = el.querySelector<HTMLElement>(".card-glare");
    if (glare) glare.style.opacity = "0";
  }, []);

  return { onMouseMove, onMouseLeave };
}
