import { MOCK_ADMIN_PETS, MOCK_ACCOUNTS } from "@/mocks";

/** Query helpers only; fixture ownership remains in src/mocks. */
export const getAdminUsers = () => MOCK_ACCOUNTS;
export const getAdminPets = () => MOCK_ADMIN_PETS;
