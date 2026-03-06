"use client";
import React from 'react';

interface NasaqOfficalBTN01Props {
    title?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function NasaqOfficalBTN01({
    title = "حجز موعد",
    onClick,
    className = "",
    type = "button",
    disabled = false,
}: NasaqOfficalBTN01Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} className={className}>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                style={{
                    backgroundColor: '#2A2C79',
                    borderRadius: '16px',
                    padding: '16px 64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    border: 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    width: '100%',
                    opacity: disabled ? 0.7 : 1,
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    boxShadow: '0 4px 14px rgba(42, 44, 121, 0.15)',
                }}
                onMouseOver={(e) => {
                    if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                    if (!disabled) e.currentTarget.style.transform = 'translateY(0)';
                }}
                onMouseDown={(e) => {
                    if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
                }}
                onMouseUp={(e) => {
                    if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)';
                }}
            >
                <span style={{
                    color: '#F1F5F9',
                    fontSize: '20px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif"
                }}>
                    {title}
                </span>
                <img
                    src="/logo-white.png"
                    alt="Nasaq Icon"
                    style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
                />
            </button>
            <span style={{
                marginTop: '12px',
                color: '#A4A4A4',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: "'IBM Plex Sans Arabic', sans-serif"
            }}>
                مدعوم من نسق
            </span>
        </div>
    );
}
