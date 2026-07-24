import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initGsap = () => {
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.8
  });
  return gsap;
};
