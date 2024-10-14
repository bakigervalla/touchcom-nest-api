# ---- Base ----
FROM node:18 AS base
WORKDIR /app
COPY . .
RUN npm install
RUN npm run prisma:client
RUN npm run build

# --- Release ----
FROM node:18 AS release
WORKDIR /app
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/tsconfig*.json ./
COPY --from=base /app/nest-cli.json ./

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start:prod"]
