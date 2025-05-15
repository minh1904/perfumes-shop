'use client';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import CartProduct from '../CartProduct';
interface ProductProps {
  products: {
    id: string;
    name: string;
    price: number;
    type: string;
    image: string | null;
  }[];
}
const ScrollProduct = ({ products }: ProductProps) => {
  gsap.registerPlugin(Draggable, InertiaPlugin);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scrollContainer = containerRef.current;
    const scrollContent = scrollContentRef.current;

    if (!scrollContainer || !scrollContent) return;

    // Lấy danh sách các card
    const cards = gsap.utils.toArray('.card', scrollContent) as HTMLElement[];
    if (cards.length === 0) return;

    // Tính chiều rộng tổng của scrollContent
    const totalWidth = cards.reduce(
      (total, card) =>
        total + card.offsetWidth + parseInt(getComputedStyle(card).marginRight || '0'),
      0,
    );

    // Tính giới hạn kéo (maxX)
    const maxX = -(totalWidth - scrollContainer.offsetWidth);

    // Tạo Draggable
    const draggable = Draggable.create(scrollContent, {
      type: 'x',
      bounds: { minX: maxX, maxX: 0 }, // Giới hạn vùng kéo
      inertia: true, // Thêm quán tính
      edgeResistance: 0.65, // Kháng lực khi kéo gần giới hạn
      snap: {
        x: (value) => {
          // Snap đến card gần nhất
          const cardWidth =
            cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight || '0');
          return Math.round(value / cardWidth) * cardWidth;
        },
      },
    })[0];

    // Cập nhật bounds khi resize
    const handleResize = () => {
      const newTotalWidth = cards.reduce(
        (total, card) =>
          total + card.offsetWidth + parseInt(getComputedStyle(card).marginRight || '0'),
        0,
      );
      const newMaxX = -(newTotalWidth - scrollContainer.offsetWidth);
      draggable.update();
      draggable.vars.bounds = { minX: newMaxX, maxX: 0 };
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      draggable.kill();
      gsap.killTweensOf(scrollContent);
    };
  }, []);
  return (
    <div ref={containerRef} className="scrollContainer w-full overflow-hidden">
      <div ref={scrollContentRef} className="scrollContent flex" style={{ cursor: 'grab' }}>
        {products.map((product) => (
          <div className="card flex-none" key={product.id} style={{ marginRight: '20px' }}>
            <CartProduct products={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollProduct;
