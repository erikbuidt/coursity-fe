'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const MobileNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger Icon */}
      <button
        className="p-2 bg-primary text-white rounded-md focus:outline-none"
        onClick={toggleMenu}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-white shadow-lg z-50">
          <nav className="flex flex-col space-y-4 p-4">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <Link href="/my-courses" className="text-primary hover:underline">
              My Learning
            </Link>
            <Link href="/about" className="text-primary hover:underline">
              About
            </Link>
            <div className="space-y-2">
              <SignedOut>
                <SignInButton>
                  <Button className="bg-secondary hover:bg-secondary/80 text-white font-semibold rounded-full px-4 py-2">
                    <Link href="/sign-in" className="text-black">
                      Sign in
                    </Link>
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNavBar;
