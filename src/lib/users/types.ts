import type { User } from "@clerk/astro/server";

export interface UserSelecter {
  selectUser(): Promise<User>;
}

export class MockUserSelecter implements UserSelecter {
  public constructor(private mockUser: User) {}

  async selectUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return this.mockUser;
  }
}
