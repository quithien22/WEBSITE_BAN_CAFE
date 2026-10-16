const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type Options = RequestInit & { token?: string | null };

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError('Không kết nối được máy chủ', 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // NestJS trả message là string hoặc mảng string (lỗi validation)
    const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
    throw new ApiError(msg ?? 'Có lỗi xảy ra', res.status);
  }
  return data as T;
}