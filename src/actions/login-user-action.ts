'use server';

type Res = { success: true };

export async function loginUserAction(data: unknown): Promise<Res> {
  console.log(data);
  return { success: true };
}
