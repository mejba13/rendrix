import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#FF9100',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V24C24 25.1046 23.1046 26 22 26H10C8.89543 26 8 25.1046 8 24V12Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M12 10V8C12 6.89543 12.8954 6 14 6H18C19.1046 6 20 6.89543 20 8V10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="11" y="14" width="10" height="2" rx="1" fill="#FF9100" />
          <rect x="11" y="18" width="7" height="2" rx="1" fill="#FF9100" fillOpacity="0.6" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
