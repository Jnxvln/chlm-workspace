import { PrismaClient } from "@prisma/client";

// Important if you're using TypeScript!
declare global {
  var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["error"] });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["info", "error", "warn"],
    });
  }
  prisma = global.prisma;
}

export default prisma;