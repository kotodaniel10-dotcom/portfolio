const imageCache = new Map<string, string | null>();
const pendingFetches = new Map<string, Promise<string | null>>();

interface QueueItem {
  animeName: string;
  resolve: (url: string | null) => void;
}

const queue: QueueItem[] = [];
let isProcessing = false;

const MIN_DELAY = 450;

async function processQueue(): Promise<void> {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  while (queue.length > 0) {
    const item = queue.shift()!;

    if (imageCache.has(item.animeName)) {
      item.resolve(imageCache.get(item.animeName)!);
      continue;
    }

    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `query ($search: String) {
            Media(search: $search, type: ANIME) {
              coverImage { large }
            }
          }`,
          variables: { search: item.animeName },
        }),
      });

      if (res.status === 429) {
        queue.unshift(item);
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      const json = await res.json();
      const url: string | null =
        json?.data?.Media?.coverImage?.large || null;
      imageCache.set(item.animeName, url);
      item.resolve(url);
    } catch {
      imageCache.set(item.animeName, null);
      item.resolve(null);
    }

    if (queue.length > 0) {
      await new Promise((r) => setTimeout(r, MIN_DELAY));
    }
  }

  isProcessing = false;
}

export function fetchAniListImage(
  animeName: string
): Promise<string | null> {
  if (imageCache.has(animeName)) {
    return Promise.resolve(imageCache.get(animeName)!);
  }

  if (pendingFetches.has(animeName)) {
    return pendingFetches.get(animeName)!;
  }

  const promise = new Promise<string | null>((resolve) => {
    queue.push({ animeName, resolve });
    processQueue();
  });

  pendingFetches.set(animeName, promise);
  promise.finally(() => pendingFetches.delete(animeName));

  return promise;
}

export function getCachedImage(
  animeName: string
): string | null | undefined {
  return imageCache.has(animeName) ? imageCache.get(animeName) : undefined;
}
