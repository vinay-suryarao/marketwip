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
    <section className="space-y-5 rounded-3xl border border-[#d8e2f5] bg-white p-6 shadow-[0_10px_24px_rgba(24,58,120,0.1)]">
      <div className="flex items-center justify-between border-b border-[#d8e2f5] pb-4">
        <h3 className="text-lg font-bold font-display text-[#173462]">Manage Watchlist Tags</h3>
        <span className="rounded-full border border-[#bfd1f1] bg-[#f4f8ff] px-3 py-1 text-xs font-bold text-[#2e7ac9]">
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

      {!user ? <p className="text-sm font-medium text-[#6074a0]">Login required to manage wishlist.</p> : null}

      <div className="flex flex-wrap gap-2">
        {wishlist.map((tag) => (
          <button
            key={tag}
            onClick={() => removeTag(tag)}
            className="rounded-full border border-[#cddaf3] bg-[#f4f8ff] px-4 py-1.5 text-xs font-bold tracking-wide text-[#2e7ac9] transition hover:border-[#f2b0b8] hover:bg-[#fff2f4] hover:text-[#b13a4f]"
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
