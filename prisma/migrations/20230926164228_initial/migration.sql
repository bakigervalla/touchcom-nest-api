-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('RESIDENT', 'APARTMENT', 'COMPANY');

-- CreateEnum
CREATE TYPE "AccessControlStatus" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('REGISTRATION_IN_REVIEW', 'REBOOTING', 'UPDATING', 'SLEEP', 'ACTIVE', 'ERROR', 'OFF', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DOOR', 'VISITOR_PANEL');

-- CreateEnum
CREATE TYPE "SiteStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR');

-- CreateEnum
CREATE TYPE "AccessKeyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AccessKeyType" AS ENUM ('TAG', 'CARD');

-- CreateEnum
CREATE TYPE "DiagnosticsStatus" AS ENUM ('CREATED', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AccessGroupStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('ACCESS', 'USER', 'SITE', 'EVENT', 'DEVICE', 'DEVICE_EVENT', 'ACCESS_KEY', 'ACCESS_GROUP', 'CALL', 'ADMIN_AND_ROLE');

-- CreateEnum
CREATE TYPE "AccessExceptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "LockStatus" AS ENUM ('OPEN', 'CLOSE');

-- CreateEnum
CREATE TYPE "ScreenSize" AS ENUM ('INCH_10', 'INCH_13');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PermissionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "fcmToken" TEXT,
    "verificationCode" TEXT,
    "verificationCodeExpiration" TIMESTAMP(3),
    "otpRequestCooldownExpiration" TIMESTAMP(3),
    "name" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "type" "UserType" NOT NULL DEFAULT 'RESIDENT',
    "floor" INTEGER DEFAULT 0,
    "number" TEXT,
    "imageUrl" TEXT,
    "roleId" INTEGER NOT NULL,
    "addressId" INTEGER,
    "companyId" INTEGER,
    "apartmentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessKey" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT,
    "pin" TEXT,
    "type" "AccessKeyType" NOT NULL DEFAULT 'TAG',
    "status" "AccessKeyStatus" NOT NULL DEFAULT 'ACTIVE',
    "consumption" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "failedAccessAttempts" INTEGER NOT NULL DEFAULT 0,
    "accessFailedAt" TIMESTAMP(3),
    "description" TEXT,
    "siteId" INTEGER NOT NULL,
    "accessControlId" INTEGER,
    "accessKeyProviderId" INTEGER NOT NULL,
    "accessTimeScheduleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessKeyProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessKeyProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "floor" INTEGER NOT NULL DEFAULT 0,
    "type" "DeviceType" NOT NULL DEFAULT 'VISITOR_PANEL',
    "status" "DeviceStatus" NOT NULL DEFAULT 'REGISTRATION_IN_REVIEW',
    "imageUrl" TEXT,
    "twilioRoomName" TEXT,
    "siteId" INTEGER NOT NULL,
    "versionId" INTEGER NOT NULL,
    "configurationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#FF671D',
    "status" "AccessGroupStatus" NOT NULL DEFAULT 'ACTIVE',
    "siteId" INTEGER NOT NULL,
    "accessTimeScheduleId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessTimeSchedule" (
    "id" SERIAL NOT NULL,
    "applyEveryDay" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeMonday" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeTuesday" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeWednesday" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeThursday" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeFriday" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeSaturday" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeSunday" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessTimeSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessTime" (
    "id" SERIAL NOT NULL,
    "accessStartsAt" TEXT NOT NULL,
    "accessEndsAt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeScheduleAccessTime" (
    "id" SERIAL NOT NULL,
    "accessTimeId" INTEGER NOT NULL,
    "timeScheduleId" INTEGER NOT NULL,
    "day" "Day" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeScheduleAccessTime_pkey" PRIMARY KEY ("timeScheduleId","accessTimeId")
);

-- CreateTable
CREATE TABLE "AccessException" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lockStatus" "LockStatus" NOT NULL DEFAULT 'OPEN',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "startTime" TEXT,
    "endTime" TEXT,
    "applySingleDate" BOOLEAN NOT NULL DEFAULT false,
    "applyWholeDay" BOOLEAN NOT NULL DEFAULT false,
    "applyForNextYear" BOOLEAN NOT NULL DEFAULT false,
    "status" "AccessExceptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessException_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessGroupAccessException" (
    "id" SERIAL NOT NULL,
    "accessGroupId" INTEGER NOT NULL,
    "accessExceptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessGroupAccessException_pkey" PRIMARY KEY ("accessGroupId","accessExceptionId")
);

-- CreateTable
CREATE TABLE "AccessControl" (
    "id" SERIAL NOT NULL,
    "failedAccessAttempts" INTEGER NOT NULL DEFAULT 0,
    "accessFailedAt" TIMESTAMP(3),
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "status" "AccessControlStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" INTEGER,
    "deviceId" INTEGER,
    "accessGroupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" SERIAL NOT NULL,
    "lockStatus" "LockStatus" NOT NULL DEFAULT 'OPEN',
    "screenSize" "ScreenSize" NOT NULL DEFAULT 'INCH_10',
    "heartbeatInterval" INTEGER NOT NULL DEFAULT 300,
    "mainScreenDelay" INTEGER NOT NULL DEFAULT 30,
    "waitBranchLevel" INTEGER NOT NULL DEFAULT 20,
    "activeBranchLevel" INTEGER NOT NULL DEFAULT 100,
    "volumeLevel" INTEGER NOT NULL DEFAULT 100,
    "horizontal" BOOLEAN NOT NULL DEFAULT false,
    "rotation" DOUBLE PRECISION NOT NULL DEFAULT 90,
    "cameraRotation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scaling" INTEGER NOT NULL DEFAULT 100,
    "closeDoorTime" INTEGER NOT NULL DEFAULT 10,
    "callTimeout" INTEGER NOT NULL DEFAULT 30,
    "height" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "aspectRatioX" DOUBLE PRECISION,
    "aspectRatioY" DOUBLE PRECISION,
    "adbPort" INTEGER NOT NULL DEFAULT 5555,
    "isDarkTheme" BOOLEAN NOT NULL DEFAULT false,
    "darkThemeStart" TIMESTAMP(3),
    "darkThemeEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessControlChangeLog" (
    "id" SERIAL NOT NULL,
    "failedAccessAttempts" INTEGER NOT NULL DEFAULT 0,
    "accessFailedAt" TIMESTAMP(3),
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "status" "AccessControlStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" INTEGER,
    "deviceId" INTEGER,
    "accessGroupId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessControlChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDeviceConfiguration" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "deviceConfigurationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDeviceConfiguration_pkey" PRIMARY KEY ("userId","deviceId","deviceConfigurationId")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "floor" INTEGER DEFAULT 0,
    "status" "SiteStatus" NOT NULL DEFAULT 'ACTIVE',
    "imageUrl" TEXT,
    "addressId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "siteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSite_pkey" PRIMARY KEY ("userId","siteId")
);

-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "countryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isoAlphaCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnostics" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "rebootDate" TIMESTAMP(3),
    "rebootTime" TIMESTAMP(3),
    "status" "DiagnosticsStatus" NOT NULL DEFAULT 'CREATED',
    "logFileGcsKey" TEXT,
    "deviceId" INTEGER,
    "siteId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnostics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_tag_key" ON "AccessKey"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_accessControlId_key" ON "AccessKey"("accessControlId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AccessControl_userId_deviceId_accessGroupId_key" ON "AccessControl"("userId", "deviceId", "accessGroupId");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessKey" ADD CONSTRAINT "AccessKey_accessControlId_fkey" FOREIGN KEY ("accessControlId") REFERENCES "AccessControl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessKey" ADD CONSTRAINT "AccessKey_accessKeyProviderId_fkey" FOREIGN KEY ("accessKeyProviderId") REFERENCES "AccessKeyProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessKey" ADD CONSTRAINT "AccessKey_accessTimeScheduleId_fkey" FOREIGN KEY ("accessTimeScheduleId") REFERENCES "AccessTimeSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessGroup" ADD CONSTRAINT "AccessGroup_accessTimeScheduleId_fkey" FOREIGN KEY ("accessTimeScheduleId") REFERENCES "AccessTimeSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeScheduleAccessTime" ADD CONSTRAINT "TimeScheduleAccessTime_accessTimeId_fkey" FOREIGN KEY ("accessTimeId") REFERENCES "AccessTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeScheduleAccessTime" ADD CONSTRAINT "TimeScheduleAccessTime_timeScheduleId_fkey" FOREIGN KEY ("timeScheduleId") REFERENCES "AccessTimeSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessGroupAccessException" ADD CONSTRAINT "AccessGroupAccessException_accessGroupId_fkey" FOREIGN KEY ("accessGroupId") REFERENCES "AccessGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessGroupAccessException" ADD CONSTRAINT "AccessGroupAccessException_accessExceptionId_fkey" FOREIGN KEY ("accessExceptionId") REFERENCES "AccessException"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD CONSTRAINT "AccessControl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD CONSTRAINT "AccessControl_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessControl" ADD CONSTRAINT "AccessControl_accessGroupId_fkey" FOREIGN KEY ("accessGroupId") REFERENCES "AccessGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeviceConfiguration" ADD CONSTRAINT "UserDeviceConfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeviceConfiguration" ADD CONSTRAINT "UserDeviceConfiguration_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDeviceConfiguration" ADD CONSTRAINT "UserDeviceConfiguration_deviceConfigurationId_fkey" FOREIGN KEY ("deviceConfigurationId") REFERENCES "Configuration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSite" ADD CONSTRAINT "UserSite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSite" ADD CONSTRAINT "UserSite_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostics" ADD CONSTRAINT "Diagnostics_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostics" ADD CONSTRAINT "Diagnostics_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
