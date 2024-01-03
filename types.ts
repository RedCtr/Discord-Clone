import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersAndProfiles = Server & {
    members: (Member & { profile: Profile })[]
}