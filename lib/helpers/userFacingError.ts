function getErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code?: string }).code);
  }
  return "";
}

export function toFriendlyAuthErrorMessage(error: unknown, fallback = "We could not process your request right now.") {
  const code = getErrorCode(error);

  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Email or password is incorrect.";
  }

  if (code === "auth/email-already-in-use") {
    return "This email is already registered. Please login instead.";
  }

  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }

  if (code === "auth/weak-password") {
    return "Password is too weak. Please use at least 6 characters.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please wait and try again.";
  }

  if (code === "auth/network-request-failed") {
    return "Network issue detected. Please check your internet and try again.";
  }

  return fallback;
}

export function toFriendlyAppErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("insufficient permissions") || message.includes("permission-denied")) {
    return "You do not have permission to perform this action.";
  }

  if (message.includes("network")) {
    return "Network issue detected. Please check your internet and try again.";
  }

  if (message.includes("upload")) {
    return "Image upload failed. Please try with a different image.";
  }

  return fallback;
}
