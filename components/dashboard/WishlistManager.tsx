"use client";

import { FormEvent, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistManager() {
  const { user } = useAuth();
  const { wishlist, addTag, removeTag, isLoading } = useWishlist(user?.uid);
  const [nextTag, setNextTag] = useState("");

  const normalized = useMemo(() => nextTag.trim().toUpperCase(), [nextTag]);

  const onAdd = async (event: FormEvent) => {
    event.preventDefault();
    if (!normalized) return;
    await addTag(normalized);
    setNextTag("");
  };

  return (
    <section className="space-y-5 rounded-3xl border border-[#1A2552] bg-[#060B19]/50 backdrop-blur-md p-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#1A2552] pb-4">
        <h3 className="text-lg font-bold font-display text-white">Manage Watchlist Tags</h3>
        <span className="rounded-full bg-[#4353FF] px-3 py-1 text-xs font-bold text-white shadow-[0_0_10px_rgba(67,83,255,0.3)]">
          {wishlist.length} tags
        </span>
      </div>

      <form onSubmit={onAdd} className="flex gap-2">
        <Input
          value={nextTag}
          onChange={(event) => setNextTag(event.target.value)}
          placeholder="Example: RELIANCE"
          disabled={!user || isLoading}
        />
        <Button type="submit" disabled={!user || isLoading} className="rounded-xl px-5 py-3">
          Add
        </Button>
      </form>

      {!user ? <p className="text-sm font-medium text-[#8B95A5]">Login required to manage wishlist.</p> : null}

      <div className="flex flex-wrap gap-2">
        {wishlist.map((tag) => (
          <button
            key={tag}
            onClick={() => removeTag(tag)}
            className="rounded-full border border-[#1A2552] bg-[#0A102E] px-4 py-1.5 text-xs font-bold tracking-wide text-[#00F0FF] transition hover:bg-[#FF5B79]/20 hover:text-[#FF5B79] hover:border-[#FF5B79]/30"
            type="button"
            disabled={isLoading}
          >
            {tag} ×
          </button>
        ))}
      </div>
    </section>
  );
}
