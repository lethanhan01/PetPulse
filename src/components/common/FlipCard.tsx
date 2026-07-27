import { type ReactNode } from "react";

type Props = {
  front: ReactNode;
  back: ReactNode;
};

export function FlipCard({ front, back }: Props) {
  return (
    <div className="flip-card h-full">
      <div className="flip-card-inner">
        <div className="flip-card-front">{front}</div>
        <div className="flip-card-back">{back}</div>
      </div>
    </div>
  );
}
