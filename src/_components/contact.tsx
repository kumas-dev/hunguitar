"use client";

import { useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { contactMethods, locationInfo, KAKAO_MAP_APP_KEY } from "@/constants";

// 카카오맵 타입 선언
declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number }
        ) => {
          setCenter: (latlng: unknown) => void;
        };
        Marker: new (options: { position: unknown; map: unknown }) => unknown;
        CustomOverlay: new (options: {
          content: string;
          position: unknown;
          yAnchor: number;
        }) => {
          setMap: (map: unknown) => void;
        };
      };
    };
  }
}

function NaverIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 512 512">
      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
    </svg>
  );
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222v2.218a.472.472 0 0 0 .944 0v-1.58l.478-.464 1.576 2.19a.472.472 0 0 0 .766-.552l-1.706-2.373zm-7.165-1.95a.472.472 0 0 0-.47.472v3.537H8.907a.472.472 0 0 0 0 .944h1.837a.472.472 0 0 0 .472-.472V9.582a.472.472 0 0 0-.474-.472zm2.553 0a.472.472 0 0 0-.472.472v4.009a.472.472 0 0 0 .944 0V9.582a.472.472 0 0 0-.472-.472zm-5.06 0a.472.472 0 0 0-.404.727l1.443 2.36-1.443 2.36a.472.472 0 0 0 .404.883.472.472 0 0 0 .404-.227l1.18-1.93 1.18 1.93a.472.472 0 0 0 .808-.49l-1.443-2.36 1.443-2.36a.472.472 0 0 0-.404-.883.472.472 0 0 0-.404.227l-1.18 1.93-1.18-1.93a.472.472 0 0 0-.404-.237z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 384 512">
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
    </svg>
  );
}

export default function Contact() {
  const sectionRef = useScrollAnimation<HTMLElement>();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const center = new window.kakao.maps.LatLng(
          locationInfo.lat,
          locationInfo.lng
        );

        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 4,
        });

        mapInstanceRef.current = map;

        // 마커 추가
        new window.kakao.maps.Marker({
          position: center,
          map,
        });

        // 커스텀 오버레이
        const overlayContent = `
          <div style="
            padding: 12px 16px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 14px;
            font-weight: 600;
            color: #333;
            white-space: nowrap;
          ">
            <a href="${locationInfo.kakaoPlaceUrl}" target="_blank" style="text-decoration: none; color: inherit;">
              훈:어쿠스틱기타하우스
            </a>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          content: overlayContent,
          position: center,
          yAnchor: 2.5,
        });

        overlay.setMap(map);
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const renderIcon = (type: string, className: string) => {
    switch (type) {
      case "naver":
        return <NaverIcon className={className} />;
      case "phone":
        return <PhoneIcon className={className} />;
      case "kakao":
        return <KakaoIcon className={className} />;
      default:
        return null;
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 bg-surface animate-on-scroll"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-heading uppercase mb-2">
            Contact
          </h2>
          <hr className="w-16 border-t-4 border-primary mx-auto mb-4" />
          <p className="text-muted">편하게 문의해 주세요</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <a
              key={method.type}
              href={method.url}
              target={method.type !== "phone" ? "_blank" : undefined}
              rel={method.type !== "phone" ? "noreferrer" : undefined}
              className={`group relative rounded-2xl p-8 ${method.bgColor} ${method.hoverColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative Background */}
              <div
                className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 ${
                  method.type === "phone" ? "bg-primary" : "bg-black/10"
                }`}
              />

              <div className="relative text-center">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    method.type === "phone" ? "bg-primary/10" : "bg-white/20"
                  }`}
                >
                  {renderIcon(
                    method.icon,
                    `w-8 h-8 ${
                      method.type === "phone"
                        ? "text-primary"
                        : method.type === "kakao"
                        ? "text-[#3C1E1E]"
                        : "text-white"
                    }`
                  )}
                </div>

                {/* Title */}
                <h3
                  className={`text-xl font-bold mb-2 ${
                    method.textColor || "text-white"
                  }`}
                >
                  {method.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm whitespace-pre-line ${
                    method.type === "phone"
                      ? "text-muted"
                      : method.type === "kakao"
                      ? "text-[#3C1E1E]/70"
                      : "text-white/80"
                  }`}
                >
                  {method.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Map */}
            <div className="lg:col-span-2 h-[300px] lg:h-[400px]">
              <div ref={mapRef} className="w-full h-full" />
            </div>

            {/* Location Info */}
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LocationIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-heading">오시는 길</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted mb-1">주소</p>
                  <p className="text-heading font-medium">
                    {locationInfo.address}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted mb-1">교통편</p>
                  <p className="text-heading text-sm">
                    {locationInfo.directions}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <a
                    href={locationInfo.kakaoPlaceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#FEE500] text-[#3C1E1E] font-semibold rounded-xl hover:bg-[#fdd800] transition-colors duration-300"
                  >
                    <LocationIcon className="w-5 h-5" />
                    카카오맵
                  </a>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(
                      locationInfo.address
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#03C75A] text-white font-semibold rounded-xl hover:bg-[#02b351] transition-colors duration-300"
                  >
                    <LocationIcon className="w-5 h-5" />
                    네이버지도
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
