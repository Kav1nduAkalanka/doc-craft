import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

// --- Animated Character Components ---
interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

export interface AnimatedAuthBackgroundProps {
  isTyping: boolean;
  passwordLength: number;
  showPassword: boolean;
}

export const AnimatedAuthBackground: React.FC<AnimatedAuthBackgroundProps> = ({ isTyping, passwordLength, showPassword }) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isBlueBlinking, setIsBlueBlinking] = useState(false);
  const [isDarkBlinking, setIsDarkBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isBluePeeking, setIsBluePeeking] = useState(false);

  const blueRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);
  const indigoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effect for back character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlueBlinking(true);
        setTimeout(() => {
          setIsBlueBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };
    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Blinking effect for middle character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000;
    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsDarkBlinking(true);
        setTimeout(() => {
          setIsDarkBlinking(false);
          scheduleBlink();
        }, 150);
      }, getRandomBlinkInterval());
      return blinkTimeout;
    };
    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Looking at each other animation when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Back character sneaky peeking animation when typing password and it's visible
  useEffect(() => {
    if (passwordLength > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsBluePeeking(true);
          setTimeout(() => setIsBluePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return peekInterval;
      };
      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsBluePeeking(false);
    }
  }, [passwordLength, showPassword, isBluePeeking]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
  };

  const bluePos = calculatePosition(blueRef);
  const darkPos = calculatePosition(darkRef);
  const cyanPos = calculatePosition(cyanRef);
  const indigoPos = calculatePosition(indigoRef);

  return (
    <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-brand-500/20 via-brand-600/10 to-transparent p-12 overflow-hidden border-r border-surface-700/30">
      <div className="relative z-20">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText size={20} className="text-white" />
          </div>
          <span>
            Doc<span className="text-brand-400">Craft</span>
          </span>
        </Link>
      </div>

      <div className="relative z-20 flex items-end justify-center h-[500px]">
        <div className="relative" style={{ width: '550px', height: '400px' }}>
          {/* Blue tall rectangle character (Back layer) */}
          <div 
            ref={blueRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: '70px',
              width: '180px',
              height: (isTyping || (passwordLength > 0 && !showPassword)) ? '440px' : '400px',
              backgroundColor: '#3B82F6', // Theme adjustment: Brand Blue
              borderRadius: '10px 10px 0 0',
              zIndex: 1,
              transform: (passwordLength > 0 && showPassword)
                ? `skewX(0deg)`
                : (isTyping || (passwordLength > 0 && !showPassword))
                  ? `skewX(${(bluePos.bodySkew || 0) - 12}deg) translateX(40px)` 
                  : `skewX(${bluePos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div 
              className="absolute flex gap-8 transition-all duration-700 ease-in-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${20}px` : isLookingAtEachOther ? `${55}px` : `${45 + bluePos.faceX}px`,
                top: (passwordLength > 0 && showPassword) ? `${35}px` : isLookingAtEachOther ? `${65}px` : `${40 + bluePos.faceY}px`,
              }}
            >
              <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isBlueBlinking} forceLookX={(passwordLength > 0 && showPassword) ? (isBluePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? (isBluePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isBlueBlinking} forceLookX={(passwordLength > 0 && showPassword) ? (isBluePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? (isBluePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
            </div>
          </div>

          {/* Dark Surface tall rectangle character (Middle layer) */}
          <div 
            ref={darkRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: '240px',
              width: '120px',
              height: '310px',
              backgroundColor: '#1E293B', // Theme adjustment: Slate 800
              borderRadius: '8px 8px 0 0',
              zIndex: 2,
              transform: (passwordLength > 0 && showPassword)
                ? `skewX(0deg)`
                : isLookingAtEachOther
                  ? `skewX(${(darkPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : (isTyping || (passwordLength > 0 && !showPassword))
                    ? `skewX(${(darkPos.bodySkew || 0) * 1.5}deg)` 
                    : `skewX(${darkPos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div 
              className="absolute flex gap-6 transition-all duration-700 ease-in-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${10}px` : isLookingAtEachOther ? `${32}px` : `${26 + darkPos.faceX}px`,
                top: (passwordLength > 0 && showPassword) ? `${28}px` : isLookingAtEachOther ? `${12}px` : `${32 + darkPos.faceY}px`,
              }}
            >
              <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isDarkBlinking} forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
              <EyeBall size={16} pupilSize={6} maxDistance={4} isBlinking={isDarkBlinking} forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
            </div>
          </div>

          {/* Cyan semi-circle character (Front left) */}
          <div 
            ref={cyanRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: '0px',
              width: '240px',
              height: '200px',
              zIndex: 3,
              backgroundColor: '#06B6D4', // Theme adjustment: Cyan 500
              borderRadius: '120px 120px 0 0',
              transform: (passwordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${cyanPos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div 
              className="absolute flex gap-8 transition-all duration-200 ease-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${50}px` : `${82 + (cyanPos.faceX || 0)}px`,
                top: (passwordLength > 0 && showPassword) ? `${85}px` : `${90 + (cyanPos.faceY || 0)}px`,
              }}
            >
              <Pupil size={12} maxDistance={5} pupilColor="#1E293B" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} pupilColor="#1E293B" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
            </div>
          </div>

          {/* Indigo tall rectangle character (Front right) */}
          <div 
            ref={indigoRef}
            className="absolute bottom-0 transition-all duration-700 ease-in-out"
            style={{
              left: '310px',
              width: '140px',
              height: '230px',
              backgroundColor: '#6366F1', // Theme adjustment: Indigo 500
              borderRadius: '70px 70px 0 0',
              zIndex: 4,
              transform: (passwordLength > 0 && showPassword) ? `skewX(0deg)` : `skewX(${indigoPos.bodySkew || 0}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div 
              className="absolute flex gap-6 transition-all duration-200 ease-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${20}px` : `${52 + (indigoPos.faceX || 0)}px`,
                top: (passwordLength > 0 && showPassword) ? `${35}px` : `${40 + (indigoPos.faceY || 0)}px`,
              }}
            >
              <Pupil size={12} maxDistance={5} pupilColor="#1E293B" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
              <Pupil size={12} maxDistance={5} pupilColor="#1E293B" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
            </div>
            <div 
              className="absolute w-20 h-[4px] bg-[#1E293B] rounded-full transition-all duration-200 ease-out"
              style={{
                left: (passwordLength > 0 && showPassword) ? `${10}px` : `${40 + (indigoPos.faceX || 0)}px`,
                top: (passwordLength > 0 && showPassword) ? `${88}px` : `${88 + (indigoPos.faceY || 0)}px`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 flex items-center gap-8 text-sm text-surface-400">
        <Link to="/" className="hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full">Back to Home</Link>
        <a href="#" className="hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all hover:after:w-full">Contact</a>
      </div>

      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
    </div>
  );
};
