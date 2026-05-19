import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import React from "react";
import { useMemo, useState } from "react";
import neoguriOriginalPacket from "./assets/neoguri-original.jpeg";
import neoguriTornPacket from "./assets/neoguri-front.jpg";
import neoguriTopStrip from "./assets/neoguri-top-strip.png";

const OPENING_MS = 1480;

function drawKelpCount() {
  const r = Math.random();
  if (r < 0.969) return 1;
  if (r < 0.999) return 2;
  return 3;
}

function makeKelpItems(count) {
  const spread = count === 1 ? [0] : count === 2 ? [-32, 34] : [-56, 0, 58];

  return Array.from({ length: count }, (_, index) => {
    const offset = spread[index] ?? 0;
    return {
      id: `${Date.now()}-${index}`,
      x: offset + (Math.random() * 18 - 9),
      y: -124 - Math.random() * 34 - count * 13,
      rotate: (Math.random() * 64 - 32) + (index - 1) * 10,
      delay: 0.46 + index * (count === 3 ? 0.09 : 0.16),
      scale: 0.86 + Math.random() * 0.28 + count * 0.06,
    };
  });
}

function makeParticles(count) {
  const amount = count === 3 ? 34 : count === 2 ? 16 : 5;

  return Array.from({ length: amount }, (_, index) => {
    const angle = (Math.PI * 2 * index) / amount + Math.random() * 0.35;
    const distance = 72 + Math.random() * (count === 3 ? 220 : 105);
    return {
      id: `p-${Date.now()}-${index}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 70,
      delay: 0.58 + Math.random() * 0.24,
      size: count === 3 ? 5 + Math.random() * 10 : 4 + Math.random() * 6,
      color: Math.random() > 0.45 ? "#ffd84a" : "#fff2ad",
    };
  });
}

function getResultCopy(count) {
  if (count === 3) return "미친!!! 다시마 3개!!!!!";
  if (count === 2) return "어? 두 개다!!";
  return "오... 한 개 들어있네";
}

function KelpPiece({ item, intensity }) {
  return (
    <motion.div
      className="absolute left-1/2 top-[31%] h-24 w-16 origin-bottom overflow-hidden rounded-sm border border-lime-200/25 bg-gradient-to-br from-emerald-700 via-green-950 to-lime-900 shadow-[inset_-12px_-16px_18px_rgba(0,0,0,0.24),0_12px_20px_rgba(0,0,0,0.32)]"
      initial={{ x: "-50%", y: 8, rotate: 0, scale: 0.25, opacity: 0 }}
      animate={{
        x: `calc(-50% + ${item.x}px)`,
        y: item.y,
        rotate: item.rotate,
        scale: item.scale,
        opacity: 1,
      }}
      transition={{
        delay: item.delay,
        type: "spring",
        stiffness: intensity === "mega" ? 540 : 390,
        damping: intensity === "mega" ? 10 : 15,
        mass: 0.8,
      }}
    >
      <div className="absolute inset-1 border border-lime-300/10" />
      <div className="absolute left-3 top-0 h-full w-2 bg-lime-300/10 blur-[1px]" />
      <div className="absolute right-4 top-0 h-full w-1 bg-black/15" />
      <div className="absolute left-0 top-5 h-1 w-full bg-lime-200/10" />
      <div className="absolute left-0 top-14 h-1 w-full bg-black/10" />
    </motion.div>
  );
}

function TornStripPiece({ side }) {
  const isLeft = side === "left";

  return (
    <motion.div
      className={`absolute -top-1 h-14 w-[62%] overflow-hidden bg-white/95 shadow-[0_10px_18px_rgba(0,0,0,0.22)] ${
        isLeft ? "left-0 origin-right" : "right-0 origin-left"
      }`}
      style={{
        clipPath: isLeft
          ? "polygon(0 7%, 100% 0, 88% 100%, 0 78%)"
          : "polygon(0 0, 100% 7%, 100% 78%, 12% 100%)",
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 0.98 }}
      animate={{
        x: isLeft ? -44 : 44,
        y: -24,
        rotate: isLeft ? -12 : 12,
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.52, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <img
        src={neoguriTopStrip}
        alt=""
        aria-hidden="true"
        className={`absolute top-[-8px] h-auto w-[184%] select-none contrast-125 saturate-125 ${
          isLeft ? "left-0" : "right-0"
        }`}
        draggable="false"
      />
    </motion.div>
  );
}

function TearEffect({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <div className="pointer-events-none absolute inset-x-[11%] top-[2.5%] z-30 h-20 overflow-visible drop-shadow-[0_10px_14px_rgba(0,0,0,0.35)]">
          <TornStripPiece side="left" />
          <TornStripPiece side="right" />
          <motion.div
            className="absolute left-1/2 top-4 h-1.5 w-[74%] -translate-x-1/2 rounded-full bg-white/90 shadow-[0_0_22px_rgba(255,255,255,0.75)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 0.34, ease: "easeOut" }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

function ParticleBurst({ particles, show }) {
  return (
    <AnimatePresence>
      {show &&
        particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="pointer-events-none absolute left-1/2 top-[34%] z-40 rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 0 }}
            animate={{ x: particle.x, y: particle.y, scale: [0, 1.25, 0], opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ delay: particle.delay, duration: 1.05, ease: "easeOut" }}
          />
        ))}
    </AnimatePresence>
  );
}

export default function App() {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [resultCount, setResultCount] = useState(null);
  const [kelpItems, setKelpItems] = useState([]);
  const [particles, setParticles] = useState([]);
  const packetControls = useAnimationControls();

  const intensity = resultCount === 3 ? "mega" : resultCount === 2 ? "rare" : "plain";
  const packetImage = isOpening || isOpened ? neoguriTornPacket : neoguriOriginalPacket;
  const resultCopy = useMemo(() => (resultCount ? getResultCopy(resultCount) : ""), [resultCount]);

  async function openPacket() {
    if (isOpening || isOpened) return;

    const count = drawKelpCount();
    setResultCount(count);
    setKelpItems(makeKelpItems(count));
    setParticles(makeParticles(count));
    setIsOpening(true);

    packetControls.start({
      x: count === 3 ? [0, -12, 14, -16, 16, -8, 0] : [0, -6, 7, -4, 3, 0],
      rotate: count === 3 ? [0, -3, 3, -4, 4, -1, 0] : [0, -1.6, 1.6, -1, 0],
      scale: count === 3 ? [1, 1.04, 1.12, 1.03, 1] : [1, 1.03, 1],
      transition: { duration: count === 3 ? 0.9 : 0.56, ease: "easeInOut" },
    });

    window.setTimeout(() => {
      setIsOpening(false);
      setIsOpened(true);
    }, OPENING_MS);
  }

  function resetGame() {
    setIsOpening(false);
    setIsOpened(false);
    setResultCount(null);
    setKelpItems([]);
    setParticles([]);
    packetControls.set({ x: 0, rotate: 0, scale: 1 });
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#11100f] px-4 py-8 text-white transition-transform duration-300 ${
        intensity === "mega" && isOpened ? "scale-[1.025]" : "scale-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,194,45,0.2),transparent_31%),linear-gradient(145deg,rgba(126,20,17,0.24),transparent_42%),#11100f]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-center gap-6">
        <motion.div
          className="text-center"
          animate={intensity === "mega" && isOpened ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.42 }}
        >
          <p className="text-sm font-black uppercase tracking-[0.24em] text-yellow-300/80">Dashima Draw</p>
          <h1 className="mt-2 font-display text-3xl leading-tight text-white drop-shadow-[0_5px_0_rgba(0,0,0,0.45)] sm:text-5xl">
            너구리 라면 다시마 뽑기
          </h1>
        </motion.div>

        <div className="relative flex w-full max-w-[430px] items-center justify-center sm:max-w-[500px]">
          <ParticleBurst particles={particles} show={isOpened || isOpening} />

          <motion.button
            type="button"
            aria-label="너구리 라면 봉지를 눌러 다시마 개수를 확인하기"
            disabled={isOpening || isOpened}
            onClick={openPacket}
            animate={packetControls}
            whileHover={!isOpening && !isOpened ? { scale: 1.045, rotate: [-0.6, 0.6, -0.3, 0.3, 0] } : undefined}
            whileTap={!isOpening && !isOpened ? { scale: 0.97 } : undefined}
            className="group relative z-20 w-[min(74vw,340px)] touch-manipulation border-0 bg-transparent p-0 outline-none disabled:cursor-default sm:w-[360px]"
          >
            <span className="absolute -inset-7 -z-10 rounded-full bg-yellow-400/10 blur-3xl transition-opacity group-hover:opacity-100" />
            <TearEffect active={isOpening || isOpened} />
            <motion.img
              src={packetImage}
              alt="너구리 라면 봉지"
              className="relative z-10 h-auto w-full select-none drop-shadow-2xl"
              draggable="false"
              animate={
                isOpened
                  ? { clipPath: "polygon(0 12%, 42% 12%, 50% 18%, 58% 12%, 100% 12%, 100% 100%, 0 100%)" }
                  : { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }
              }
              transition={{ duration: 0.26 }}
            />
            {!isOpened && !isOpening && (
              <motion.span
                className="absolute left-1/2 top-3 z-30 h-2 w-28 -translate-x-1/2 rounded-full bg-white/35 blur-sm"
                animate={{ opacity: [0.22, 0.75, 0.22], scaleX: [0.72, 1.05, 0.72] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              />
            )}
          </motion.button>

          <div className="pointer-events-none absolute inset-0 z-30">
            {kelpItems.map((item) => (
              <KelpPiece key={item.id} item={item} intensity={intensity} />
            ))}
          </div>

          <AnimatePresence>
            {isOpening && (
              <motion.div
                className="absolute top-[20%] z-50 rounded-md bg-white px-5 py-2 font-display text-4xl text-red-600 shadow-glow"
                initial={{ opacity: 0, scale: 0.4, rotate: -12, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.16, 1, 1.05], rotate: [-12, 5, -2, 2], y: [-6, -34, -42, -48] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.82, ease: "easeOut" }}
              >
                촤악!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="min-h-[132px] text-center">
          <AnimatePresence mode="wait">
            {!isOpened && !isOpening && (
              <motion.p
                key="hint"
                className="text-xl font-extrabold text-yellow-100 sm:text-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                봉지를 눌러 다시마 확인하기
              </motion.p>
            )}

            {isOpened && (
              <motion.div
                key="result"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 18, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: intensity === "mega" ? [0.95, 1.12, 1] : 1,
                }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
              >
                <p
                  className={`font-display leading-tight drop-shadow-[0_5px_0_rgba(0,0,0,0.48)] ${
                    intensity === "mega"
                      ? "text-4xl text-yellow-300 sm:text-6xl"
                      : intensity === "rare"
                        ? "text-3xl text-yellow-200 sm:text-5xl"
                        : "text-2xl text-white sm:text-4xl"
                  }`}
                >
                  {resultCopy}
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  className="rounded-md bg-yellow-300 px-6 py-3 text-lg font-black text-neutral-950 shadow-[0_8px_0_#9d4311] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_#9d4311]"
                >
                  다시 뜯기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
