"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PromptToast from "@/components/ui/PromptToast";
import { uploadImageToImgBB } from "@/lib/helpers/imgbbUpload";
import { NEWS_CATEGORIES } from "@/constants/newsCategories";
import { NewsPost } from "@/types/post";
import { useTimedPrompt } from "@/hooks/useTimedPrompt";
import { toFriendlyAppErrorMessage } from "@/lib/helpers/userFacingError";

type FormState = {
  title: string;
  content: string;
  stockTag: string;
  category: string;
};

type AdminPostFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: NewsPost;
  submitButtonText?: string;
};

export default function AdminPostForm({
  onSubmit,
  initialData,
  submitButtonText = "Create Post",
}: AdminPostFormProps) {
  const [form, setForm] = useState<FormState>({
    title: "",
    content: "",
    stockTag: "",
    category: NEWS_CATEGORIES[0].value,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        content: initialData.content,
        stockTag: initialData.stockTag,
        category: initialData.category,
      });
    }
  }, [initialData]);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(initialData?.imageUrl || null);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearPrompt();

    try {
      let imageUrl = initialData?.imageUrl || "";
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("stockTag", form.stockTag.trim().toUpperCase());
      formData.append("category", form.category);
      formData.append("imageUrl", imageUrl);

      await onSubmit(formData);

    } catch (error) {
      showPrompt(toFriendlyAppErrorMessage(error, "Unable to submit post. Please try again."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-6 rounded-[2rem] border border-[#1A2552] bg-[#060B19] p-7 shadow-lg relative z-10"
    >
      <Input
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="News title"
        required
      />

      <Input
        name="image"
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />

      {imagePreview && (
        <div className="my-4">
          <Image
            src={imagePreview}
            alt="Post preview"
            width={1200}
            height={720}
            unoptimized
            className="h-52 w-full rounded-lg object-cover"
          />
        </div>
      )}

      <textarea
        name="content"
        value={form.content}
        onChange={onChange}
        placeholder="News details"
        rows={9}
        required
        className="w-full rounded-xl border border-[#1A2552] bg-[#0A102E] px-5 py-4 text-[15px] font-medium text-white placeholder:text-[#8B95A5] outline-none transition focus:border-[#00F0FF] focus:ring-4 focus:ring-[#00F0FF]/20"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          name="stockTag"
          value={form.stockTag}
          onChange={onChange}
          placeholder="Enter stock tag (example: RELIANCE)"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={onChange}
          className="w-full rounded-xl border border-[#1A2552] bg-[#0A102E] px-4 py-3.5 text-[15px] font-medium text-white outline-none transition focus:border-[#00F0FF]"
        >
          {NEWS_CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : submitButtonText}
      </Button>

      {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
    </form>
  );
}
