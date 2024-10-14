import { Logger } from '@nestjs/common';
import { Country, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createCountries = async (): Promise<Country[]> => {
  const logger = new Logger('Seed');

  logger.verbose('Creating countries...');

  const country1: Country = await prisma.country.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Afghanistan',
      isoAlphaCode: 'AF',
    },
  });

  const country2: Country = await prisma.country.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Åland Islands',
      isoAlphaCode: 'AX',
    },
  });

  const country3: Country = await prisma.country.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Albania',
      isoAlphaCode: 'AL',
    },
  });

  const country4: Country = await prisma.country.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Algeria',
      isoAlphaCode: 'DZ',
    },
  });

  const country5: Country = await prisma.country.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'American Samoa',
      isoAlphaCode: 'AS',
    },
  });

  const country6: Country = await prisma.country.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Andorra',
      isoAlphaCode: 'AD',
    },
  });

  const country7: Country = await prisma.country.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'Angola',
      isoAlphaCode: 'AO',
    },
  });

  const country8: Country = await prisma.country.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'Anguilla',
      isoAlphaCode: 'AI',
    },
  });

  const country9: Country = await prisma.country.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: 'Antarctica',
      isoAlphaCode: 'AQ',
    },
  });

  const country10: Country = await prisma.country.upsert({
    where: { id: 10 },
    update: {},
    create: {
      name: 'Antigua and Barbuda',
      isoAlphaCode: 'AG',
    },
  });

  const country11: Country = await prisma.country.upsert({
    where: { id: 11 },
    update: {},
    create: {
      name: 'Argentina',
      isoAlphaCode: 'AR',
    },
  });

  const country12: Country = await prisma.country.upsert({
    where: { id: 12 },
    update: {},
    create: {
      name: 'Armenia',
      isoAlphaCode: 'AM',
    },
  });

  const country13: Country = await prisma.country.upsert({
    where: { id: 13 },
    update: {},
    create: {
      name: 'Aruba',
      isoAlphaCode: 'AW',
    },
  });

  const country14: Country = await prisma.country.upsert({
    where: { id: 14 },
    update: {},
    create: {
      name: 'Australia',
      isoAlphaCode: 'AU',
    },
  });

  const country15: Country = await prisma.country.upsert({
    where: { id: 15 },
    update: {},
    create: {
      name: 'Austria',
      isoAlphaCode: 'AT',
    },
  });

  const country16: Country = await prisma.country.upsert({
    where: { id: 16 },
    update: {},
    create: {
      name: 'Azerbaijan',
      isoAlphaCode: 'AZ',
    },
  });

  const country17: Country = await prisma.country.upsert({
    where: { id: 17 },
    update: {},
    create: {
      name: 'Bahamas',
      isoAlphaCode: 'BS',
    },
  });

  const country18: Country = await prisma.country.upsert({
    where: { id: 18 },
    update: {},
    create: {
      name: 'Bahrain',
      isoAlphaCode: 'BH',
    },
  });

  const country19: Country = await prisma.country.upsert({
    where: { id: 19 },
    update: {},
    create: {
      name: 'Bangladesh',
      isoAlphaCode: 'BD',
    },
  });

  const country20: Country = await prisma.country.upsert({
    where: { id: 20 },
    update: {},
    create: {
      name: 'Barbados',
      isoAlphaCode: 'BB',
    },
  });

  const country21: Country = await prisma.country.upsert({
    where: { id: 21 },
    update: {},
    create: {
      name: 'Belarus',
      isoAlphaCode: 'BY',
    },
  });

  const country22: Country = await prisma.country.upsert({
    where: { id: 22 },
    update: {},
    create: {
      name: 'Belgium',
      isoAlphaCode: 'BE',
    },
  });

  const country23: Country = await prisma.country.upsert({
    where: { id: 23 },
    update: {},
    create: {
      name: 'Belize',
      isoAlphaCode: 'BZ',
    },
  });

  const country24: Country = await prisma.country.upsert({
    where: { id: 24 },
    update: {},
    create: {
      name: 'Benin',
      isoAlphaCode: 'BJ',
    },
  });

  const country25: Country = await prisma.country.upsert({
    where: { id: 25 },
    update: {},
    create: {
      name: 'Bermuda',
      isoAlphaCode: 'BM',
    },
  });

  const country26: Country = await prisma.country.upsert({
    where: { id: 26 },
    update: {},
    create: {
      name: 'Bhutan',
      isoAlphaCode: 'BT',
    },
  });

  const country27: Country = await prisma.country.upsert({
    where: { id: 27 },
    update: {},
    create: {
      name: 'Bolivia',
      isoAlphaCode: 'BO',
    },
  });

  const country28: Country = await prisma.country.upsert({
    where: { id: 28 },
    update: {},
    create: {
      name: 'Bosnia and Herzegovina',
      isoAlphaCode: 'BA',
    },
  });

  const country29: Country = await prisma.country.upsert({
    where: { id: 29 },
    update: {},
    create: {
      name: 'Botswana',
      isoAlphaCode: 'BW',
    },
  });

  const country30: Country = await prisma.country.upsert({
    where: { id: 30 },
    update: {},
    create: {
      name: 'Bouvet Island',
      isoAlphaCode: 'BV',
    },
  });

  const country31: Country = await prisma.country.upsert({
    where: { id: 31 },
    update: {},
    create: {
      name: 'Brazil',
      isoAlphaCode: 'BR',
    },
  });

  const country32: Country = await prisma.country.upsert({
    where: { id: 32 },
    update: {},
    create: {
      name: 'British Indian Ocean Territory',
      isoAlphaCode: 'IO',
    },
  });

  const country33: Country = await prisma.country.upsert({
    where: { id: 33 },
    update: {},
    create: {
      name: 'Brunei Darussalam',
      isoAlphaCode: 'BN',
    },
  });

  const country34: Country = await prisma.country.upsert({
    where: { id: 34 },
    update: {},
    create: {
      name: 'Bulgaria',
      isoAlphaCode: 'BG',
    },
  });

  const country35: Country = await prisma.country.upsert({
    where: { id: 35 },
    update: {},
    create: {
      name: 'Burkina Faso',
      isoAlphaCode: 'BF',
    },
  });

  const country36: Country = await prisma.country.upsert({
    where: { id: 36 },
    update: {},
    create: {
      name: 'Burundi',
      isoAlphaCode: 'BI',
    },
  });

  const country37: Country = await prisma.country.upsert({
    where: { id: 37 },
    update: {},
    create: {
      name: 'Cambodia',
      isoAlphaCode: 'KH',
    },
  });

  const country38: Country = await prisma.country.upsert({
    where: { id: 38 },
    update: {},
    create: {
      name: 'Cameroon',
      isoAlphaCode: 'CM',
    },
  });

  const country39: Country = await prisma.country.upsert({
    where: { id: 39 },
    update: {},
    create: {
      name: 'Canada',
      isoAlphaCode: 'CA',
    },
  });

  const country40: Country = await prisma.country.upsert({
    where: { id: 40 },
    update: {},
    create: {
      name: 'Cape Verde',
      isoAlphaCode: 'CV',
    },
  });

  const country41: Country = await prisma.country.upsert({
    where: { id: 41 },
    update: {},
    create: {
      name: 'Cayman Islands',
      isoAlphaCode: 'KY',
    },
  });

  const country42: Country = await prisma.country.upsert({
    where: { id: 42 },
    update: {},
    create: {
      name: 'Central African Republic',
      isoAlphaCode: 'CF',
    },
  });

  const country43: Country = await prisma.country.upsert({
    where: { id: 43 },
    update: {},
    create: {
      name: 'Chad',
      isoAlphaCode: 'TD',
    },
  });

  const country44: Country = await prisma.country.upsert({
    where: { id: 44 },
    update: {},
    create: {
      name: 'Chile',
      isoAlphaCode: 'CL',
    },
  });

  const country45: Country = await prisma.country.upsert({
    where: { id: 45 },
    update: {},
    create: {
      name: 'China',
      isoAlphaCode: 'CN',
    },
  });

  const country46: Country = await prisma.country.upsert({
    where: { id: 46 },
    update: {},
    create: {
      name: 'Christmas Island',
      isoAlphaCode: 'CX',
    },
  });

  const country47: Country = await prisma.country.upsert({
    where: { id: 47 },
    update: {},
    create: {
      name: 'Cocos (Keeling) Islands',
      isoAlphaCode: 'CC',
    },
  });

  const country48: Country = await prisma.country.upsert({
    where: { id: 48 },
    update: {},
    create: {
      name: 'Colombia',
      isoAlphaCode: 'CO',
    },
  });

  const country49: Country = await prisma.country.upsert({
    where: { id: 49 },
    update: {},
    create: {
      name: 'Comoros',
      isoAlphaCode: 'KM',
    },
  });

  const country50: Country = await prisma.country.upsert({
    where: { id: 50 },
    update: {},
    create: {
      name: 'Congo',
      isoAlphaCode: 'CG',
    },
  });

  const country51: Country = await prisma.country.upsert({
    where: { id: 51 },
    update: {},
    create: {
      name: 'Congo, The Democratic Republic of the',
      isoAlphaCode: 'CD',
    },
  });

  const country52: Country = await prisma.country.upsert({
    where: { id: 52 },
    update: {},
    create: {
      name: 'Cook Islands',
      isoAlphaCode: 'CK',
    },
  });

  const country53: Country = await prisma.country.upsert({
    where: { id: 53 },
    update: {},
    create: {
      name: 'Costa Rica',
      isoAlphaCode: 'CR',
    },
  });

  const country54: Country = await prisma.country.upsert({
    where: { id: 54 },
    update: {},
    create: {
      name: "Cote D'Ivoire",
      isoAlphaCode: 'CI',
    },
  });

  const country55: Country = await prisma.country.upsert({
    where: { id: 55 },
    update: {},
    create: {
      name: 'Croatia',
      isoAlphaCode: 'HR',
    },
  });

  const country56: Country = await prisma.country.upsert({
    where: { id: 56 },
    update: {},
    create: {
      name: 'Cuba',
      isoAlphaCode: 'CU',
    },
  });

  const country57: Country = await prisma.country.upsert({
    where: { id: 57 },
    update: {},
    create: {
      name: 'Cyprus',
      isoAlphaCode: 'CY',
    },
  });

  const country58: Country = await prisma.country.upsert({
    where: { id: 58 },
    update: {},
    create: {
      name: 'Czech Republic',
      isoAlphaCode: 'CZ',
    },
  });

  const country59: Country = await prisma.country.upsert({
    where: { id: 59 },
    update: {},
    create: {
      name: 'Denmark',
      isoAlphaCode: 'DK',
    },
  });

  const country60: Country = await prisma.country.upsert({
    where: { id: 60 },
    update: {},
    create: {
      name: 'Djibouti',
      isoAlphaCode: 'DJ',
    },
  });

  const country61: Country = await prisma.country.upsert({
    where: { id: 61 },
    update: {},
    create: {
      name: 'Dominica',
      isoAlphaCode: 'DM',
    },
  });

  const country62: Country = await prisma.country.upsert({
    where: { id: 62 },
    update: {},
    create: {
      name: 'Dominican Republic',
      isoAlphaCode: 'DO',
    },
  });

  const country63: Country = await prisma.country.upsert({
    where: { id: 63 },
    update: {},
    create: {
      name: 'Ecuador',
      isoAlphaCode: 'EC',
    },
  });

  const country64: Country = await prisma.country.upsert({
    where: { id: 64 },
    update: {},
    create: {
      name: 'Egypt',
      isoAlphaCode: 'EG',
    },
  });

  const country65: Country = await prisma.country.upsert({
    where: { id: 65 },
    update: {},
    create: {
      name: 'El Salvador',
      isoAlphaCode: 'SV',
    },
  });

  const country66: Country = await prisma.country.upsert({
    where: { id: 66 },
    update: {},
    create: {
      name: 'Equatorial Guinea',
      isoAlphaCode: 'GQ',
    },
  });

  const country67: Country = await prisma.country.upsert({
    where: { id: 67 },
    update: {},
    create: {
      name: 'Eritrea',
      isoAlphaCode: 'ER',
    },
  });

  const country68: Country = await prisma.country.upsert({
    where: { id: 68 },
    update: {},
    create: {
      name: 'Estonia',
      isoAlphaCode: 'EE',
    },
  });

  const country69: Country = await prisma.country.upsert({
    where: { id: 69 },
    update: {},
    create: {
      name: 'Ethiopia',
      isoAlphaCode: 'ET',
    },
  });

  const country70: Country = await prisma.country.upsert({
    where: { id: 70 },
    update: {},
    create: {
      name: 'Falkland Islands (Malvinas)',
      isoAlphaCode: 'FK',
    },
  });

  const country71: Country = await prisma.country.upsert({
    where: { id: 71 },
    update: {},
    create: {
      name: 'Faroe Islands',
      isoAlphaCode: 'FO',
    },
  });

  const country72: Country = await prisma.country.upsert({
    where: { id: 72 },
    update: {},
    create: {
      name: 'Fiji',
      isoAlphaCode: 'FJ',
    },
  });

  const country73: Country = await prisma.country.upsert({
    where: { id: 73 },
    update: {},
    create: {
      name: 'Finland',
      isoAlphaCode: 'FI',
    },
  });

  const country74: Country = await prisma.country.upsert({
    where: { id: 74 },
    update: {},
    create: {
      name: 'France',
      isoAlphaCode: 'FR',
    },
  });

  const country75: Country = await prisma.country.upsert({
    where: { id: 75 },
    update: {},
    create: {
      name: 'French Guiana',
      isoAlphaCode: 'GF',
    },
  });

  const country76: Country = await prisma.country.upsert({
    where: { id: 76 },
    update: {},
    create: {
      name: 'French Polynesia',
      isoAlphaCode: 'PF',
    },
  });

  const country77: Country = await prisma.country.upsert({
    where: { id: 77 },
    update: {},
    create: {
      name: 'French Southern Territories',
      isoAlphaCode: 'TF',
    },
  });

  const country78: Country = await prisma.country.upsert({
    where: { id: 78 },
    update: {},
    create: {
      name: 'Gabon',
      isoAlphaCode: 'GA',
    },
  });

  const country79: Country = await prisma.country.upsert({
    where: { id: 79 },
    update: {},
    create: {
      name: 'Gambia',
      isoAlphaCode: 'GM',
    },
  });

  const country80: Country = await prisma.country.upsert({
    where: { id: 80 },
    update: {},
    create: {
      name: 'Georgia',
      isoAlphaCode: 'GE',
    },
  });

  const country81: Country = await prisma.country.upsert({
    where: { id: 81 },
    update: {},
    create: {
      name: 'Germany',
      isoAlphaCode: 'DE',
    },
  });

  const country82: Country = await prisma.country.upsert({
    where: { id: 82 },
    update: {},
    create: {
      name: 'Ghana',
      isoAlphaCode: 'GH',
    },
  });

  const country83: Country = await prisma.country.upsert({
    where: { id: 83 },
    update: {},
    create: {
      name: 'Gibraltar',
      isoAlphaCode: 'GI',
    },
  });

  const country84: Country = await prisma.country.upsert({
    where: { id: 84 },
    update: {},
    create: {
      name: 'Greece',
      isoAlphaCode: 'GR',
    },
  });

  const country85: Country = await prisma.country.upsert({
    where: { id: 85 },
    update: {},
    create: {
      name: 'Greenland',
      isoAlphaCode: 'GL',
    },
  });

  const country86: Country = await prisma.country.upsert({
    where: { id: 86 },
    update: {},
    create: {
      name: 'Grenada',
      isoAlphaCode: 'GD',
    },
  });

  const country87: Country = await prisma.country.upsert({
    where: { id: 87 },
    update: {},
    create: {
      name: 'Guadeloupe',
      isoAlphaCode: 'GP',
    },
  });

  const country88: Country = await prisma.country.upsert({
    where: { id: 88 },
    update: {},
    create: {
      name: 'Guam',
      isoAlphaCode: 'GU',
    },
  });

  const country89: Country = await prisma.country.upsert({
    where: { id: 89 },
    update: {},
    create: {
      name: 'Guatemala',
      isoAlphaCode: 'GT',
    },
  });

  const country90: Country = await prisma.country.upsert({
    where: { id: 90 },
    update: {},
    create: {
      name: 'Guernsey',
      isoAlphaCode: 'GG',
    },
  });

  const country91: Country = await prisma.country.upsert({
    where: { id: 91 },
    update: {},
    create: {
      name: 'Guinea',
      isoAlphaCode: 'GN',
    },
  });

  const country92: Country = await prisma.country.upsert({
    where: { id: 92 },
    update: {},
    create: {
      name: 'Guinea-Bissau',
      isoAlphaCode: 'GW',
    },
  });

  const country93: Country = await prisma.country.upsert({
    where: { id: 93 },
    update: {},
    create: {
      name: 'Guyana',
      isoAlphaCode: 'GY',
    },
  });

  const country94: Country = await prisma.country.upsert({
    where: { id: 94 },
    update: {},
    create: {
      name: 'Haiti',
      isoAlphaCode: 'HT',
    },
  });

  const country95: Country = await prisma.country.upsert({
    where: { id: 95 },
    update: {},
    create: {
      name: 'Heard Island and Mcdonald Islands',
      isoAlphaCode: 'HM',
    },
  });

  const country96: Country = await prisma.country.upsert({
    where: { id: 96 },
    update: {},
    create: {
      name: 'Holy See (Vatican City State)',
      isoAlphaCode: 'VA',
    },
  });

  const country97: Country = await prisma.country.upsert({
    where: { id: 97 },
    update: {},
    create: {
      name: 'Honduras',
      isoAlphaCode: 'HN',
    },
  });

  const country98: Country = await prisma.country.upsert({
    where: { id: 98 },
    update: {},
    create: {
      name: 'Hong Kong',
      isoAlphaCode: 'HK',
    },
  });

  const country99: Country = await prisma.country.upsert({
    where: { id: 99 },
    update: {},
    create: {
      name: 'Hungary',
      isoAlphaCode: 'HU',
    },
  });

  const country100: Country = await prisma.country.upsert({
    where: { id: 100 },
    update: {},
    create: {
      name: 'Iceland',
      isoAlphaCode: 'IS',
    },
  });

  const country101: Country = await prisma.country.upsert({
    where: { id: 101 },
    update: {},
    create: {
      name: 'India',
      isoAlphaCode: 'IN',
    },
  });

  const country102: Country = await prisma.country.upsert({
    where: { id: 102 },
    update: {},
    create: {
      name: 'Indonesia',
      isoAlphaCode: 'ID',
    },
  });

  const country103: Country = await prisma.country.upsert({
    where: { id: 103 },
    update: {},
    create: {
      name: 'Iran, Islamic Republic Of',
      isoAlphaCode: 'IR',
    },
  });

  const country104: Country = await prisma.country.upsert({
    where: { id: 104 },
    update: {},
    create: {
      name: 'Iraq',
      isoAlphaCode: 'IQ',
    },
  });

  const country105: Country = await prisma.country.upsert({
    where: { id: 105 },
    update: {},
    create: {
      name: 'Ireland',
      isoAlphaCode: 'IE',
    },
  });

  const country106: Country = await prisma.country.upsert({
    where: { id: 106 },
    update: {},
    create: {
      name: 'Isle of Man',
      isoAlphaCode: 'IM',
    },
  });

  const country107: Country = await prisma.country.upsert({
    where: { id: 107 },
    update: {},
    create: {
      name: 'Israel',
      isoAlphaCode: 'IL',
    },
  });

  const country108: Country = await prisma.country.upsert({
    where: { id: 108 },
    update: {},
    create: {
      name: 'Italy',
      isoAlphaCode: 'IT',
    },
  });

  const country109: Country = await prisma.country.upsert({
    where: { id: 109 },
    update: {},
    create: {
      name: 'Jamaica',
      isoAlphaCode: 'JM',
    },
  });

  const country110: Country = await prisma.country.upsert({
    where: { id: 110 },
    update: {},
    create: {
      name: 'Japan',
      isoAlphaCode: 'JP',
    },
  });

  const country111: Country = await prisma.country.upsert({
    where: { id: 111 },
    update: {},
    create: {
      name: 'Jersey',
      isoAlphaCode: 'JE',
    },
  });

  const country112: Country = await prisma.country.upsert({
    where: { id: 112 },
    update: {},
    create: {
      name: 'Jordan',
      isoAlphaCode: 'JO',
    },
  });

  const country113: Country = await prisma.country.upsert({
    where: { id: 113 },
    update: {},
    create: {
      name: 'Kazakhstan',
      isoAlphaCode: 'KZ',
    },
  });

  const country114: Country = await prisma.country.upsert({
    where: { id: 114 },
    update: {},
    create: {
      name: 'Kenya',
      isoAlphaCode: 'KE',
    },
  });

  const country115: Country = await prisma.country.upsert({
    where: { id: 115 },
    update: {},
    create: {
      name: 'Kiribati',
      isoAlphaCode: 'KI',
    },
  });

  const country116: Country = await prisma.country.upsert({
    where: { id: 116 },
    update: {},
    create: {
      name: "Korea, Democratic People'S Republic of",
      isoAlphaCode: 'KP',
    },
  });

  const country117: Country = await prisma.country.upsert({
    where: { id: 117 },
    update: {},
    create: {
      name: 'Korea, Republic of',
      isoAlphaCode: 'KR',
    },
  });

  const country118: Country = await prisma.country.upsert({
    where: { id: 118 },
    update: {},
    create: {
      name: 'Kuwait',
      isoAlphaCode: 'KW',
    },
  });

  const country119: Country = await prisma.country.upsert({
    where: { id: 119 },
    update: {},
    create: {
      name: 'Kyrgyzstan',
      isoAlphaCode: 'KG',
    },
  });

  const country120: Country = await prisma.country.upsert({
    where: { id: 120 },
    update: {},
    create: {
      name: "Lao People'S Democratic Republic",
      isoAlphaCode: 'LA',
    },
  });

  const country121: Country = await prisma.country.upsert({
    where: { id: 121 },
    update: {},
    create: {
      name: 'Latvia',
      isoAlphaCode: 'LV',
    },
  });

  const country122: Country = await prisma.country.upsert({
    where: { id: 122 },
    update: {},
    create: {
      name: 'Lebanon',
      isoAlphaCode: 'LB',
    },
  });

  const country123: Country = await prisma.country.upsert({
    where: { id: 123 },
    update: {},
    create: {
      name: 'Lesotho',
      isoAlphaCode: 'LS',
    },
  });

  const country124: Country = await prisma.country.upsert({
    where: { id: 124 },
    update: {},
    create: {
      name: 'Liberia',
      isoAlphaCode: 'LR',
    },
  });

  const country125: Country = await prisma.country.upsert({
    where: { id: 125 },
    update: {},
    create: {
      name: 'Libyan Arab Jamahiriya',
      isoAlphaCode: 'LY',
    },
  });

  const country126: Country = await prisma.country.upsert({
    where: { id: 126 },
    update: {},
    create: {
      name: 'Liechtenstein',
      isoAlphaCode: 'LI',
    },
  });

  const country127: Country = await prisma.country.upsert({
    where: { id: 127 },
    update: {},
    create: {
      name: 'Lithuania',
      isoAlphaCode: 'LT',
    },
  });

  const country128: Country = await prisma.country.upsert({
    where: { id: 128 },
    update: {},
    create: {
      name: 'Luxembourg',
      isoAlphaCode: 'LU',
    },
  });

  const country129: Country = await prisma.country.upsert({
    where: { id: 129 },
    update: {},
    create: {
      name: 'Macao',
      isoAlphaCode: 'MO',
    },
  });

  const country130: Country = await prisma.country.upsert({
    where: { id: 130 },
    update: {},
    create: {
      name: 'Macedonia, The Former Yugoslav Republic of',
      isoAlphaCode: 'MK',
    },
  });

  const country131: Country = await prisma.country.upsert({
    where: { id: 131 },
    update: {},
    create: {
      name: 'Madagascar',
      isoAlphaCode: 'MG',
    },
  });

  const country132: Country = await prisma.country.upsert({
    where: { id: 132 },
    update: {},
    create: {
      name: 'Malawi',
      isoAlphaCode: 'MW',
    },
  });

  const country133: Country = await prisma.country.upsert({
    where: { id: 133 },
    update: {},
    create: {
      name: 'Malaysia',
      isoAlphaCode: 'MY',
    },
  });

  const country134: Country = await prisma.country.upsert({
    where: { id: 134 },
    update: {},
    create: {
      name: 'Maldives',
      isoAlphaCode: 'MV',
    },
  });

  const country135: Country = await prisma.country.upsert({
    where: { id: 135 },
    update: {},
    create: {
      name: 'Mali',
      isoAlphaCode: 'ML',
    },
  });

  const country136: Country = await prisma.country.upsert({
    where: { id: 136 },
    update: {},
    create: {
      name: 'Malta',
      isoAlphaCode: 'MT',
    },
  });

  const country137: Country = await prisma.country.upsert({
    where: { id: 137 },
    update: {},
    create: {
      name: 'Marshall Islands',
      isoAlphaCode: 'MH',
    },
  });

  const country138: Country = await prisma.country.upsert({
    where: { id: 138 },
    update: {},
    create: {
      name: 'Martinique',
      isoAlphaCode: 'MQ',
    },
  });

  const country139: Country = await prisma.country.upsert({
    where: { id: 139 },
    update: {},
    create: {
      name: 'Mauritania',
      isoAlphaCode: 'MR',
    },
  });

  const country140: Country = await prisma.country.upsert({
    where: { id: 140 },
    update: {},
    create: {
      name: 'Mauritius',
      isoAlphaCode: 'MU',
    },
  });

  const country141: Country = await prisma.country.upsert({
    where: { id: 141 },
    update: {},
    create: {
      name: 'Mayotte',
      isoAlphaCode: 'YT',
    },
  });

  const country142: Country = await prisma.country.upsert({
    where: { id: 142 },
    update: {},
    create: {
      name: 'Mexico',
      isoAlphaCode: 'MX',
    },
  });

  const country143: Country = await prisma.country.upsert({
    where: { id: 143 },
    update: {},
    create: {
      name: 'Micronesia, Federated States of',
      isoAlphaCode: 'FM',
    },
  });

  const country144: Country = await prisma.country.upsert({
    where: { id: 144 },
    update: {},
    create: {
      name: 'Moldova, Republic of',
      isoAlphaCode: 'MD',
    },
  });

  const country145: Country = await prisma.country.upsert({
    where: { id: 145 },
    update: {},
    create: {
      name: 'Monaco',
      isoAlphaCode: 'MC',
    },
  });

  const country146: Country = await prisma.country.upsert({
    where: { id: 146 },
    update: {},
    create: {
      name: 'Mongolia',
      isoAlphaCode: 'MN',
    },
  });

  const country147: Country = await prisma.country.upsert({
    where: { id: 147 },
    update: {},
    create: {
      name: 'Montserrat',
      isoAlphaCode: 'MS',
    },
  });

  const country148: Country = await prisma.country.upsert({
    where: { id: 148 },
    update: {},
    create: {
      name: 'Morocco',
      isoAlphaCode: 'MA',
    },
  });

  const country149: Country = await prisma.country.upsert({
    where: { id: 149 },
    update: {},
    create: {
      name: 'Mozambique',
      isoAlphaCode: 'MZ',
    },
  });

  const country150: Country = await prisma.country.upsert({
    where: { id: 150 },
    update: {},
    create: {
      name: 'Myanmar',
      isoAlphaCode: 'MM',
    },
  });

  const country151: Country = await prisma.country.upsert({
    where: { id: 151 },
    update: {},
    create: {
      name: 'Namibia',
      isoAlphaCode: 'NA',
    },
  });

  const country152: Country = await prisma.country.upsert({
    where: { id: 152 },
    update: {},
    create: {
      name: 'Nauru',
      isoAlphaCode: 'NR',
    },
  });

  const country153: Country = await prisma.country.upsert({
    where: { id: 153 },
    update: {},
    create: {
      name: 'Nepal',
      isoAlphaCode: 'NP',
    },
  });

  const country154: Country = await prisma.country.upsert({
    where: { id: 154 },
    update: {},
    create: {
      name: 'Netherlands',
      isoAlphaCode: 'NL',
    },
  });

  const country155: Country = await prisma.country.upsert({
    where: { id: 155 },
    update: {},
    create: {
      name: 'Netherlands Antilles',
      isoAlphaCode: 'AN',
    },
  });

  const country156: Country = await prisma.country.upsert({
    where: { id: 156 },
    update: {},
    create: {
      name: 'New Caledonia',
      isoAlphaCode: 'NC',
    },
  });

  const country157: Country = await prisma.country.upsert({
    where: { id: 157 },
    update: {},
    create: {
      name: 'New Zealand',
      isoAlphaCode: 'NZ',
    },
  });

  const country158: Country = await prisma.country.upsert({
    where: { id: 158 },
    update: {},
    create: {
      name: 'Nicaragua',
      isoAlphaCode: 'NI',
    },
  });

  const country159: Country = await prisma.country.upsert({
    where: { id: 159 },
    update: {},
    create: {
      name: 'Niger',
      isoAlphaCode: 'NE',
    },
  });

  const country160: Country = await prisma.country.upsert({
    where: { id: 160 },
    update: {},
    create: {
      name: 'Nigeria',
      isoAlphaCode: 'NG',
    },
  });

  const country161: Country = await prisma.country.upsert({
    where: { id: 161 },
    update: {},
    create: {
      name: 'Niue',
      isoAlphaCode: 'NU',
    },
  });

  const country162: Country = await prisma.country.upsert({
    where: { id: 162 },
    update: {},
    create: {
      name: 'Norfolk Island',
      isoAlphaCode: 'NF',
    },
  });

  const country163: Country = await prisma.country.upsert({
    where: { id: 163 },
    update: {},
    create: {
      name: 'Northern Mariana Islands',
      isoAlphaCode: 'MP',
    },
  });

  const country164: Country = await prisma.country.upsert({
    where: { id: 164 },
    update: {},
    create: {
      name: 'Norway',
      isoAlphaCode: 'NO',
    },
  });

  const country165: Country = await prisma.country.upsert({
    where: { id: 165 },
    update: {},
    create: {
      name: 'Oman',
      isoAlphaCode: 'OM',
    },
  });

  const country166: Country = await prisma.country.upsert({
    where: { id: 166 },
    update: {},
    create: {
      name: 'Pakistan',
      isoAlphaCode: 'PK',
    },
  });

  const country167: Country = await prisma.country.upsert({
    where: { id: 167 },
    update: {},
    create: {
      name: 'Palau',
      isoAlphaCode: 'PW',
    },
  });

  const country168: Country = await prisma.country.upsert({
    where: { id: 168 },
    update: {},
    create: {
      name: 'Palestinian Territory, Occupied',
      isoAlphaCode: 'PS',
    },
  });

  const country169: Country = await prisma.country.upsert({
    where: { id: 169 },
    update: {},
    create: {
      name: 'Panama',
      isoAlphaCode: 'PA',
    },
  });

  const country170: Country = await prisma.country.upsert({
    where: { id: 170 },
    update: {},
    create: {
      name: 'Papua New Guinea',
      isoAlphaCode: 'PG',
    },
  });

  const country171: Country = await prisma.country.upsert({
    where: { id: 171 },
    update: {},
    create: {
      name: 'Paraguay',
      isoAlphaCode: 'PY',
    },
  });

  const country172: Country = await prisma.country.upsert({
    where: { id: 172 },
    update: {},
    create: {
      name: 'Peru',
      isoAlphaCode: 'PE',
    },
  });

  const country173: Country = await prisma.country.upsert({
    where: { id: 173 },
    update: {},
    create: {
      name: 'Philippines',
      isoAlphaCode: 'PH',
    },
  });

  const country174: Country = await prisma.country.upsert({
    where: { id: 174 },
    update: {},
    create: {
      name: 'Pitcairn',
      isoAlphaCode: 'PN',
    },
  });

  const country175: Country = await prisma.country.upsert({
    where: { id: 175 },
    update: {},
    create: {
      name: 'Poland',
      isoAlphaCode: 'PL',
    },
  });

  const country176: Country = await prisma.country.upsert({
    where: { id: 176 },
    update: {},
    create: {
      name: 'Portugal',
      isoAlphaCode: 'PT',
    },
  });

  const country177: Country = await prisma.country.upsert({
    where: { id: 177 },
    update: {},
    create: {
      name: 'Puerto Rico',
      isoAlphaCode: 'PR',
    },
  });

  const country178: Country = await prisma.country.upsert({
    where: { id: 178 },
    update: {},
    create: {
      name: 'Qatar',
      isoAlphaCode: 'QA',
    },
  });

  const country179: Country = await prisma.country.upsert({
    where: { id: 179 },
    update: {},
    create: {
      name: 'Reunion',
      isoAlphaCode: 'RE',
    },
  });

  const country180: Country = await prisma.country.upsert({
    where: { id: 180 },
    update: {},
    create: {
      name: 'Romania',
      isoAlphaCode: 'RO',
    },
  });

  const country181: Country = await prisma.country.upsert({
    where: { id: 181 },
    update: {},
    create: {
      name: 'Russian Federation',
      isoAlphaCode: 'RU',
    },
  });

  const country182: Country = await prisma.country.upsert({
    where: { id: 182 },
    update: {},
    create: {
      name: 'RWANDA',
      isoAlphaCode: 'RW',
    },
  });

  const country183: Country = await prisma.country.upsert({
    where: { id: 183 },
    update: {},
    create: {
      name: 'Saint Helena',
      isoAlphaCode: 'SH',
    },
  });

  const country184: Country = await prisma.country.upsert({
    where: { id: 184 },
    update: {},
    create: {
      name: 'Saint Kitts and Nevis',
      isoAlphaCode: 'KN',
    },
  });

  const country185: Country = await prisma.country.upsert({
    where: { id: 185 },
    update: {},
    create: {
      name: 'Saint Lucia',
      isoAlphaCode: 'LC',
    },
  });

  const country186: Country = await prisma.country.upsert({
    where: { id: 186 },
    update: {},
    create: {
      name: 'Saint Pierre and Miquelon',
      isoAlphaCode: 'PM',
    },
  });

  const country187: Country = await prisma.country.upsert({
    where: { id: 187 },
    update: {},
    create: {
      name: 'Saint Vincent and the Grenadines',
      isoAlphaCode: 'VC',
    },
  });

  const country188: Country = await prisma.country.upsert({
    where: { id: 188 },
    update: {},
    create: {
      name: 'Samoa',
      isoAlphaCode: 'WS',
    },
  });

  const country189: Country = await prisma.country.upsert({
    where: { id: 189 },
    update: {},
    create: {
      name: 'San Marino',
      isoAlphaCode: 'SM',
    },
  });

  const country190: Country = await prisma.country.upsert({
    where: { id: 190 },
    update: {},
    create: {
      name: 'Sao Tome and Principe',
      isoAlphaCode: 'ST',
    },
  });

  const country191: Country = await prisma.country.upsert({
    where: { id: 191 },
    update: {},
    create: {
      name: 'Saudi Arabia',
      isoAlphaCode: 'SA',
    },
  });

  const country192: Country = await prisma.country.upsert({
    where: { id: 192 },
    update: {},
    create: {
      name: 'Senegal',
      isoAlphaCode: 'SN',
    },
  });

  const country193: Country = await prisma.country.upsert({
    where: { id: 193 },
    update: {},
    create: {
      name: 'Serbia and Montenegro',
      isoAlphaCode: 'CS',
    },
  });

  const country194: Country = await prisma.country.upsert({
    where: { id: 194 },
    update: {},
    create: {
      name: 'Seychelles',
      isoAlphaCode: 'SC',
    },
  });

  const country195: Country = await prisma.country.upsert({
    where: { id: 195 },
    update: {},
    create: {
      name: 'Sierra Leone',
      isoAlphaCode: 'SL',
    },
  });

  const country196: Country = await prisma.country.upsert({
    where: { id: 196 },
    update: {},
    create: {
      name: 'Singapore',
      isoAlphaCode: 'SG',
    },
  });

  const country197: Country = await prisma.country.upsert({
    where: { id: 197 },
    update: {},
    create: {
      name: 'Slovakia',
      isoAlphaCode: 'SK',
    },
  });

  const country198: Country = await prisma.country.upsert({
    where: { id: 198 },
    update: {},
    create: {
      name: 'Slovenia',
      isoAlphaCode: 'SI',
    },
  });

  const country199: Country = await prisma.country.upsert({
    where: { id: 199 },
    update: {},
    create: {
      name: 'Solomon Islands',
      isoAlphaCode: 'SB',
    },
  });

  const country200: Country = await prisma.country.upsert({
    where: { id: 200 },
    update: {},
    create: {
      name: 'Somalia',
      isoAlphaCode: 'SO',
    },
  });

  const country201: Country = await prisma.country.upsert({
    where: { id: 201 },
    update: {},
    create: {
      name: 'South Africa',
      isoAlphaCode: 'ZA',
    },
  });

  const country202: Country = await prisma.country.upsert({
    where: { id: 202 },
    update: {},
    create: {
      name: 'South Georgia and the South Sandwich Islands',
      isoAlphaCode: 'GS',
    },
  });

  const country203: Country = await prisma.country.upsert({
    where: { id: 203 },
    update: {},
    create: {
      name: 'Spain',
      isoAlphaCode: 'ES',
    },
  });

  const country204: Country = await prisma.country.upsert({
    where: { id: 204 },
    update: {},
    create: {
      name: 'Sri Lanka',
      isoAlphaCode: 'LK',
    },
  });

  const country205: Country = await prisma.country.upsert({
    where: { id: 205 },
    update: {},
    create: {
      name: 'Sudan',
      isoAlphaCode: 'SD',
    },
  });

  const country206: Country = await prisma.country.upsert({
    where: { id: 206 },
    update: {},
    create: {
      name: 'Suriname',
      isoAlphaCode: 'SR',
    },
  });

  const country207: Country = await prisma.country.upsert({
    where: { id: 207 },
    update: {},
    create: {
      name: 'Svalbard and Jan Mayen',
      isoAlphaCode: 'SJ',
    },
  });

  const country208: Country = await prisma.country.upsert({
    where: { id: 208 },
    update: {},
    create: {
      name: 'Swaziland',
      isoAlphaCode: 'SZ',
    },
  });

  const country209: Country = await prisma.country.upsert({
    where: { id: 209 },
    update: {},
    create: {
      name: 'Sweden',
      isoAlphaCode: 'SE',
    },
  });

  const country210: Country = await prisma.country.upsert({
    where: { id: 210 },
    update: {},
    create: {
      name: 'Switzerland',
      isoAlphaCode: 'CH',
    },
  });

  const country211: Country = await prisma.country.upsert({
    where: { id: 211 },
    update: {},
    create: {
      name: 'Syrian Arab Republic',
      isoAlphaCode: 'SY',
    },
  });

  const country212: Country = await prisma.country.upsert({
    where: { id: 212 },
    update: {},
    create: {
      name: 'Taiwan, Province of China',
      isoAlphaCode: 'TW',
    },
  });

  const country213: Country = await prisma.country.upsert({
    where: { id: 213 },
    update: {},
    create: {
      name: 'Tajikistan',
      isoAlphaCode: 'TJ',
    },
  });

  const country214: Country = await prisma.country.upsert({
    where: { id: 214 },
    update: {},
    create: {
      name: 'Tanzania, United Republic of',
      isoAlphaCode: 'TZ',
    },
  });

  const country215: Country = await prisma.country.upsert({
    where: { id: 215 },
    update: {},
    create: {
      name: 'Thailand',
      isoAlphaCode: 'TH',
    },
  });

  const country216: Country = await prisma.country.upsert({
    where: { id: 216 },
    update: {},
    create: {
      name: 'Timor-Leste',
      isoAlphaCode: 'TL',
    },
  });

  const country217: Country = await prisma.country.upsert({
    where: { id: 217 },
    update: {},
    create: {
      name: 'Togo',
      isoAlphaCode: 'TG',
    },
  });

  const country218: Country = await prisma.country.upsert({
    where: { id: 218 },
    update: {},
    create: {
      name: 'Tokelau',
      isoAlphaCode: 'TK',
    },
  });

  const country219: Country = await prisma.country.upsert({
    where: { id: 219 },
    update: {},
    create: {
      name: 'Tonga',
      isoAlphaCode: 'TO',
    },
  });

  const country220: Country = await prisma.country.upsert({
    where: { id: 220 },
    update: {},
    create: {
      name: 'Trinidad and Tobago',
      isoAlphaCode: 'TT',
    },
  });

  const country221: Country = await prisma.country.upsert({
    where: { id: 221 },
    update: {},
    create: {
      name: 'Tunisia',
      isoAlphaCode: 'TN',
    },
  });

  const country222: Country = await prisma.country.upsert({
    where: { id: 222 },
    update: {},
    create: {
      name: 'Turkey',
      isoAlphaCode: 'TR',
    },
  });

  const country223: Country = await prisma.country.upsert({
    where: { id: 223 },
    update: {},
    create: {
      name: 'Turkmenistan',
      isoAlphaCode: 'TM',
    },
  });

  const country224: Country = await prisma.country.upsert({
    where: { id: 224 },
    update: {},
    create: {
      name: 'Turks and Caicos Islands',
      isoAlphaCode: 'TC',
    },
  });

  const country225: Country = await prisma.country.upsert({
    where: { id: 225 },
    update: {},
    create: {
      name: 'Tuvalu',
      isoAlphaCode: 'TV',
    },
  });

  const country226: Country = await prisma.country.upsert({
    where: { id: 226 },
    update: {},
    create: {
      name: 'Uganda',
      isoAlphaCode: 'UG',
    },
  });

  const country227: Country = await prisma.country.upsert({
    where: { id: 227 },
    update: {},
    create: {
      name: 'Ukraine',
      isoAlphaCode: 'UA',
    },
  });

  const country228: Country = await prisma.country.upsert({
    where: { id: 228 },
    update: {},
    create: {
      name: 'United Arab Emirates',
      isoAlphaCode: 'AE',
    },
  });

  const country229: Country = await prisma.country.upsert({
    where: { id: 229 },
    update: {},
    create: {
      name: 'United Kingdom',
      isoAlphaCode: 'GB',
    },
  });

  const country230: Country = await prisma.country.upsert({
    where: { id: 230 },
    update: {},
    create: {
      name: 'United States',
      isoAlphaCode: 'US',
    },
  });

  const country231: Country = await prisma.country.upsert({
    where: { id: 231 },
    update: {},
    create: {
      name: 'United States Minor Outlying Islands',
      isoAlphaCode: 'UM',
    },
  });

  const country232: Country = await prisma.country.upsert({
    where: { id: 232 },
    update: {},
    create: {
      name: 'Uruguay',
      isoAlphaCode: 'UY',
    },
  });

  const country233: Country = await prisma.country.upsert({
    where: { id: 233 },
    update: {},
    create: {
      name: 'Uzbekistan',
      isoAlphaCode: 'UZ',
    },
  });

  const country234: Country = await prisma.country.upsert({
    where: { id: 234 },
    update: {},
    create: {
      name: 'Vanuatu',
      isoAlphaCode: 'VU',
    },
  });

  const country235: Country = await prisma.country.upsert({
    where: { id: 235 },
    update: {},
    create: {
      name: 'Venezuela',
      isoAlphaCode: 'VE',
    },
  });

  const country236: Country = await prisma.country.upsert({
    where: { id: 236 },
    update: {},
    create: {
      name: 'Viet Nam',
      isoAlphaCode: 'VN',
    },
  });

  const country237: Country = await prisma.country.upsert({
    where: { id: 237 },
    update: {},
    create: {
      name: 'Virgin Islands, British',
      isoAlphaCode: 'VG',
    },
  });

  const country238: Country = await prisma.country.upsert({
    where: { id: 238 },
    update: {},
    create: {
      name: 'Virgin Islands, U.S.',
      isoAlphaCode: 'VI',
    },
  });

  const country239: Country = await prisma.country.upsert({
    where: { id: 239 },
    update: {},
    create: {
      name: 'Wallis and Futuna',
      isoAlphaCode: 'WF',
    },
  });

  const country240: Country = await prisma.country.upsert({
    where: { id: 240 },
    update: {},
    create: {
      name: 'Western Sahara',
      isoAlphaCode: 'EH',
    },
  });

  const country241: Country = await prisma.country.upsert({
    where: { id: 241 },
    update: {},
    create: {
      name: 'Yemen',
      isoAlphaCode: 'YE',
    },
  });

  const country242: Country = await prisma.country.upsert({
    where: { id: 242 },
    update: {},
    create: {
      name: 'Zambia',
      isoAlphaCode: 'ZM',
    },
  });

  const country243: Country = await prisma.country.upsert({
    where: { id: 243 },
    update: {},
    create: {
      name: 'Zimbabwe',
      isoAlphaCode: 'ZW',
    },
  });

  const country244: Country = await prisma.country.upsert({
    where: { id: 244 },
    update: {},
    create: {
      name: 'Kosovo',
      isoAlphaCode: 'KX',
    },
  });

  logger.verbose('Countries created successfully');

  return [
    country1,
    country2,
    country3,
    country4,
    country5,
    country6,
    country7,
    country8,
    country9,
    country10,
    country11,
    country12,
    country13,
    country14,
    country15,
    country16,
    country17,
    country18,
    country19,
    country20,
    country21,
    country22,
    country23,
    country24,
    country25,
    country26,
    country27,
    country28,
    country29,
    country30,
    country31,
    country32,
    country33,
    country34,
    country35,
    country36,
    country37,
    country38,
    country39,
    country40,
    country41,
    country42,
    country43,
    country44,
    country45,
    country46,
    country47,
    country48,
    country49,
    country50,
    country51,
    country52,
    country53,
    country54,
    country55,
    country56,
    country57,
    country58,
    country59,
    country60,
    country61,
    country62,
    country63,
    country64,
    country65,
    country66,
    country67,
    country68,
    country69,
    country70,
    country71,
    country72,
    country73,
    country74,
    country75,
    country76,
    country77,
    country78,
    country79,
    country80,
    country81,
    country82,
    country83,
    country84,
    country85,
    country86,
    country87,
    country88,
    country89,
    country90,
    country91,
    country92,
    country93,
    country94,
    country95,
    country96,
    country97,
    country98,
    country99,
    country100,
    country101,
    country102,
    country103,
    country104,
    country105,
    country106,
    country107,
    country108,
    country109,
    country110,
    country111,
    country112,
    country113,
    country114,
    country115,
    country116,
    country117,
    country118,
    country119,
    country120,
    country121,
    country122,
    country123,
    country124,
    country125,
    country126,
    country127,
    country128,
    country129,
    country130,
    country131,
    country132,
    country133,
    country134,
    country135,
    country136,
    country137,
    country138,
    country139,
    country140,
    country141,
    country142,
    country143,
    country144,
    country145,
    country146,
    country147,
    country148,
    country149,
    country150,
    country151,
    country152,
    country153,
    country154,
    country155,
    country156,
    country157,
    country158,
    country159,
    country160,
    country161,
    country162,
    country163,
    country164,
    country165,
    country166,
    country167,
    country168,
    country169,
    country170,
    country171,
    country172,
    country173,
    country174,
    country175,
    country176,
    country177,
    country178,
    country179,
    country180,
    country181,
    country182,
    country183,
    country184,
    country185,
    country186,
    country187,
    country188,
    country189,
    country190,
    country191,
    country192,
    country193,
    country194,
    country195,
    country196,
    country197,
    country198,
    country199,
    country200,
    country201,
    country202,
    country203,
    country204,
    country205,
    country206,
    country207,
    country208,
    country209,
    country210,
    country211,
    country212,
    country213,
    country214,
    country215,
    country216,
    country217,
    country218,
    country219,
    country220,
    country221,
    country222,
    country223,
    country224,
    country225,
    country226,
    country227,
    country228,
    country229,
    country230,
    country231,
    country232,
    country233,
    country234,
    country235,
    country236,
    country237,
    country238,
    country239,
    country240,
    country241,
    country242,
    country243,
    country244,
  ];
};

export default { createCountries };
