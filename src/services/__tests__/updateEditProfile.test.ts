import editProfile from "../../repositories/editProfile/editProfile";
import updateEditProfileService from "../editProfile/updateEditProfileService";
import { ObjectId } from "mongodb";

jest.mock("../../repositories/editProfile/editProfile", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("updateEditProfileService 테스트, 프로필을 수정합니다.", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("oldEmail 기반으로 filter.email을 설정한다", async () => {
    (editProfile as unknown as jest.Mock).mockResolvedValue({ success: true });

    const result = await updateEditProfileService({
      oldEmail: "old@test.com",
      newEmail: "new@test.com",
      name: "J",
      password: "hashedPassword",
      phone: "010-1111-2222",
      agreeSms: true,
      agreeEmail: false,
    });

    expect(editProfile).toHaveBeenCalledTimes(1);
    const lastCall = (editProfile as jest.Mock).mock.lastCall ?? [];
    const calledFilter = lastCall[0];
    const calledUpdateData = lastCall[1];

    expect(calledFilter).toEqual({ email: "old@test.com" });
    expect(calledUpdateData.email).toBe("new@test.com");
    expect(result).toEqual({ success: true });
  });

  test("userId 기반으로 filter._id를 설정한다", async () => {
    (editProfile as unknown as jest.Mock).mockResolvedValue({ success: true });
    const userId = "65c123456789abcd12345678"; // 예시 ObjectId 문자열

    await updateEditProfileService({
      userId,
      name: "J",
      password: "hashedPassword",
    });

    const lastCall = (editProfile as jest.Mock).mock.lastCall ?? [];
    const calledFilter = lastCall[0];

    expect(calledFilter._id).toBeInstanceOf(ObjectId);
    expect(calledFilter._id.toString()).toBe(userId);
  });

  test("oldEmail과 userId 둘 다 없으면 에러를 던진다", async () => {
    await expect(
      updateEditProfileService({
        password: "hashedPassword",
      }),
    ).rejects.toThrow("사용자를 식별할 수 없습니다.");
  });

  test("editProfile이 에러를 던지면 서비스도 에러를 던진다", async () => {
    (editProfile as unknown as jest.Mock).mockRejectedValue(
      new Error("DB update 실패"),
    );

    await expect(
      updateEditProfileService({
        oldEmail: "old@test.com",
        password: "hashedPassword",
      }),
    ).rejects.toThrow("DB update 실패");
  });
});
