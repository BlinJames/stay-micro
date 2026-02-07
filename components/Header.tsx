'use client';

import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="text-center py-12 md:py-16 animate-fade-in">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="p-1.5 bg-accent/10 rounded-lg">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <span className="text-sm font-medium text-gray-400">Stay Micro</span>
      </div>

      {/* Main headline */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6 px-4">
        Maîtrisez{' '}
        <span
          className="italic text-orange-300"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          votre CA
        </span>
        {' '}et restez sous le{' '}
        <span
          className="italic text-orange-300"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          plafond micro
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto px-4 leading-relaxed">
        Suivez votre chiffre d'affaires, simulez vos missions et ne dépassez jamais
        les <span className="text-white font-medium">77 700 €</span> pour garder votre statut.
      </p>
    </header>
  );
}
