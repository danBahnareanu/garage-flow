import { Car } from "../features/cars/types/car.types";

let carList: Car[] = [
  {
    "id": "1",
    "make": "Bmw",
    "model": "X5",
    "year": 2017,
    "licensePlate": "B198DVX",
    "fuel": "Diesel",
    "engineCode": "M54B30",
    "imageUrl": "file:///var/mobile/Containers/Data/Application/3B821A9B-0D31-45BD-980D-EAD5E5E238BD/Library/Caches/ImagePicker/B438AF09-C5A9-4248-AFB9-F8F55698CF9D.jpg",
    "purchasePrice": 33000,
    "currentMileage": 159000,
    "transmission": "automatic",
    "runningCosts": [
      {
        "id": "1775653633352vtzym38xi123",
        "type": "maintenance",
        "date": "2026-04-01T06:06:23.000Z",
        "amount": 670,
        "mileage": 0,
        "description": "Timing chain kit"
      },
      {
        "id": "1775653633352vtzym38xi24",
        "type": "performance",
        "date": "2025-05-01T06:06:23.000Z",
        "amount": 335,
        "mileage": 140000,
        "description": "Eibach ProKit Springs"
      },
      {
        "id": "1775653633352vtzym38xi",
        "type": "repair",
        "date": "2025-09-01T06:06:23.000Z",
        "amount": 300,
        "mileage": 150000,
        "description": "Perne Arnott spate"
      },
      {
        "id": "17756535762379uzm7eli2",
        "type": "visual mods",
        "date": "2025-07-01T06:06:23.000Z",
        "amount": 550,
        "mileage": 144000,
        "description": "Folie LLumar air80 parbriz + geamuri fata + distantiere 15mm spate, 5mm fata + folie faruri"
      },
      {
        "id": "1775653511170tl8eut7ot",
        "type": "maintenance",
        "date": "2025-05-01T06:06:23.000Z",
        "amount": 120,
        "mileage": 139542,
        "description": "Revizie + lichid frana"
      },
      {
        "id": "17756534366701mnruu5oz",
        "type": "repair",
        "date": "2025-05-01T06:06:23.000Z",
        "amount": 200,
        "mileage": 139000,
        "description": "Indreptat Jante",
        "vendor": "Top Wheels"
      },
      {
        "id": "1775653397555wfhd0lj24",
        "type": "maintenance",
        "date": "2025-05-01T06:06:23.000Z",
        "amount": 1000,
        "mileage": 139000,
        "description": "Summer tires Hankook Ventus Evo 3"
      },
      {
        "id": "1775653364124j0xn5cs6q",
        "type": "maintenance",
        "date": "2024-12-01T07:06:23.000Z",
        "amount": 1000,
        "mileage": 130000,
        "description": "Winter tires Hankook Winter Icept"
      },
      {
        "id": "1775653264886w4peivdpk",
        "type": "repair",
        "date": "2024-12-01T07:06:23.000Z",
        "amount": 120,
        "mileage": 134000,
        "description": "O2 Sensor pre-cat replacement"
      },
      {
        "id": "1775653233785zplvdxziu",
        "type": "maintenance",
        "date": "2024-11-01T07:06:23.000Z",
        "amount": 100,
        "mileage": 131234,
        "description": "Revizie"
      },
      {
        "id": "1775653156626cjb0ntlp2",
        "type": "maintenance",
        "date": "2024-08-02T06:06:23.000Z",
        "amount": 850,
        "mileage": 124500,
        "description": "Brake system refresh"
      },
      {
        "id": "1775653092484aihvibvxc",
        "type": "maintenance",
        "date": "2024-08-01T06:06:23.000Z",
        "amount": 300,
        "mileage": 124500,
        "description": "Transmission oil change"
      },
      {
        "id": "01",
        "type": "aquisition",
        "date": "2024-08-01T00:00:00.000Z",
        "amount": 33000,
        "description": "Vehicle purchase"
      }
    ],
    "insuranceHistory": [
      {
        "id": "1775650608601xlkrbygq6",
        "provider": "Grawe",
        "policyNumber": "095788524",
        "startDate": "2025-08-02T06:06:23.000Z",
        "expiryDate": "2026-08-01T06:06:23.000Z",
        "cost": 451,
        "coverageType": "RCA",
        "notificationIds": [
          "a522bd64-1263-44ed-8014-5873744492f0",
          "40bd512f-caf0-4cc6-9de8-d74f9f2c1104",
          "98231e30-8d8d-4d9b-bc82-2d2c0ea95d54",
          "0ca73934-7c55-4a4d-8da4-a6567960de9c"
        ],
        "pdfUri": "file:///var/mobile/Containers/Data/Application/9BAD1DB9-CAD8-4BFC-A259-8452904E4696/Documents/insurance-1776446108346-PolitaGRAWE.pdf"
      }
    ],
    "vin": "WBAKS410700W60591",
    "color": "Black",
    "maintenanceHistory": [
      {
        "id": "17756524704883yr2xookv",
        "date": "2026-03-01T07:06:23.000Z",
        "mileage": 158324,
        "type": "scheduled",
        "description": "Oil change + oil filter",
        "cost": 80,
        "partsReplaced": [
          {
            "name": "Liqui Moly Molygen DPF 5w-30",
            "cost": 70
          },
          {
            "name": "Mahle oil filter",
            "cost": 10
          }
        ],
        "nextServiceDate": "2027-03-01T07:06:23.000Z",
        "nextServiceMileage": 168000
      },
      {
        "id": "1775652393300y7pxnlfwh",
        "date": "2025-10-01T06:06:23.000Z",
        "mileage": 150340,
        "type": "scheduled",
        "description": "Oil change + filters",
        "cost": 60,
        "partsReplaced": [
          {
            "name": "Liqui Moly TopTec 4600 5w-30",
            "cost": 40
          },
          {
            "name": "Mahle oil filter",
            "cost": 10
          },
          {
            "name": "Mahle air filter",
            "cost": 10
          },
          {
            "name": "Uscare bile compresor",
            "cost": 0
          }
        ],
        "nextServiceDate": "2026-11-01T07:06:23.000Z",
        "nextServiceMileage": 160000
      },
      {
        "id": "1775652250651o40x9tzgp",
        "date": "2025-09-08T06:06:23.000Z",
        "mileage": 150000,
        "type": "unscheduled",
        "description": "Rear air suspension",
        "cost": 310,
        "partsReplaced": [
          {
            "name": "Arnott air bags suspension rear",
            "cost": 310
          }
        ],
        "nextServiceDate": "2025-11-01T07:06:23.000Z",
        "nextServiceMileage": 150000
      },
      {
        "id": "1775652008517r4ilx9m2v",
        "date": "2025-05-01T06:06:23.000Z",
        "mileage": 139542,
        "type": "scheduled",
        "description": "Oil change + filters and brake fluid",
        "cost": 110,
        "partsReplaced": [
          {
            "name": "Mahle oil filter",
            "cost": 10
          },
          {
            "name": "Filtru recirculare",
            "cost": 10
          },
          {
            "name": "Brake fluid",
            "cost": 20
          },
          {
            "name": "Polen filter",
            "cost": 20
          },
          {
            "name": "Liqui Moly TopTec 4600 5W-30",
            "cost": 50
          }
        ],
        "nextServiceDate": "2026-05-01T06:06:23.000Z",
        "nextServiceMileage": 150000
      },
      {
        "id": "1775651797037sseo65udk",
        "date": "2024-12-01T07:06:23.000Z",
        "mileage": 134000,
        "type": "unscheduled",
        "description": "O2 Sensor pre-cat",
        "cost": 117,
        "partsReplaced": [
          {
            "name": "O2 Bosch sensor pre-cat",
            "cost": 117
          }
        ],
        "nextServiceDate": "2025-11-01T07:06:23.000Z",
        "nextServiceMileage": 141000
      },
      {
        "id": "177565164312820c7lo6d4",
        "date": "2024-11-01T07:06:23.000Z",
        "mileage": 131234,
        "type": "scheduled",
        "description": "Oil change and fuel filter",
        "cost": 100,
        "partsReplaced": [
          {
            "name": "Liqui Moly TopTec 4600 5W-30",
            "cost": 20
          },
          {
            "name": "Oil filter Bosch",
            "cost": 10
          },
          {
            "name": "Mahle fuel filter",
            "cost": 70
          }
        ],
        "nextServiceDate": "2025-11-01T07:06:23.000Z",
        "nextServiceMileage": 141000
      },
      {
        "id": "1775651531528vxup2f15v",
        "date": "2024-08-01T06:06:23.000Z",
        "mileage": 124500,
        "type": "scheduled",
        "description": "Oil change",
        "cost": 1172,
        "partsReplaced": [
          {
            "name": "Liqui Moly TopTec 4600 5W-30",
            "cost": 20
          },
          {
            "name": "Oil filter Bosch",
            "cost": 15
          },
          {
            "name": "ZF transmission oil change kit",
            "cost": 270
          },
          {
            "name": "Front + rear brake rotors zimmerman sport",
            "cost": 517
          },
          {
            "name": "Brake pads ATE",
            "cost": 150
          },
          {
            "name": "Front brake caliper carriers",
            "cost": 200
          }
        ],
        "nextServiceDate": "2025-08-01T06:06:23.000Z",
        "nextServiceMileage": 134000
      }
    ],
    "inspectionHistory": [
      {
        "id": "17764488910391v2k7qjw4",
        "type": "ITP",
        "date": "2024-12-27T18:15:01.000Z",
        "expiryDate": "2026-12-19T18:15:01.000Z",
        "result": "pass",
        "mileage": 140000,
        "cost": 50,
        "location": "Eugen & Fiul",
        "notificationIds": [
          "dada81a3-cafb-41a4-85f8-1a3d621d06d8",
          "0479f999-92ab-498a-a573-f351d7ddeb72",
          "b9f01608-2eb4-4121-a002-0253b496e1ff",
          "6d36f2d4-a033-427b-ba28-5e783b6c24d1"
        ]
      }
    ],
    "vignetteHistory": [
      {
        "id": "1776448993885ychpsgcdv",
        "name": "Ro-vignette",
        "country": "Romania",
        "purchaseDate": "2025-08-08T17:15:01.000Z",
        "expiryDate": "2026-08-07T17:15:01.000Z",
        "cost": 36,
        "notificationIds": [
          "9dadd539-9071-4d46-9095-bb4b99821950",
          "ff8df13e-7664-4bd8-acfb-7c49836a964e",
          "f0a62fc5-fadc-440d-9dc9-5bbb0251a2f2",
          "16ec186b-0db1-4bd9-ba4d-c2f47ce64166"
        ]
      }
    ]
  },
  {
    "id": "4",
    "make": "Saab",
    "model": "9-3 Convertible",
    "year": 2005,
    "licensePlate": "B134DVX",
    "fuel": "petrol",
    "engineCode": "B207L",
    "imageUrl": "file:///var/mobile/Containers/Data/Application/3B821A9B-0D31-45BD-980D-EAD5E5E238BD/Library/Caches/ImagePicker/3769ECB4-DB0C-4857-97E2-6166BF1DF743.jpg",
    "insuranceHistory": [
      {
        "id": "1773392697762hbqblla1b",
        "provider": "Test",
        "policyNumber": "1",
        "startDate": "2026-01-07T09:07:07.000Z",
        "expiryDate": "2026-03-20T09:04:20.000Z",
        "cost": 1,
        "coverageType": "Rca",
        "notificationIds": []
      },
      {
        "id": "1773392503859s5bjxl75e",
        "provider": "Axeria",
        "policyNumber": "54110211176",
        "startDate": "2025-12-21T08:57:41.000Z",
        "expiryDate": "2026-12-20T08:57:41.000Z",
        "cost": 260,
        "coverageType": "RCA",
        "notificationIds": [
          "eaa2fa33-efb0-498e-a7f3-690cd2714de7",
          "25fa3f84-f45e-4497-9d35-bf1a5a43a093",
          "f7b1f0bb-bb30-472b-919e-27489280447f",
          "2fe75344-a4b9-4118-a0b4-7db5a93fc621"
        ],
        "pdfUri": "file:///var/mobile/Containers/Data/Application/9BAD1DB9-CAD8-4BFC-A259-8452904E4696/Documents/insurance-1776447945958-PolitaAXERIA%20(4).pdf"
      }
    ],
    "inspectionHistory": [
      {
        "id": "1",
        "type": "ITP",
        "date": "2024-12-05T14:48:00.000Z",
        "expiryDate": "2025-12-05T14:48:00.000Z",
        "result": "pass",
        "mileage": 274000,
        "cost": 50
      },
      {
        "id": "2",
        "type": "ITP",
        "date": "2025-12-05T14:48:00.000Z",
        "expiryDate": "2026-12-05T14:48:00.000Z",
        "result": "pass",
        "mileage": 285000,
        "cost": 50,
        "notes": "Gainarie required pentru noxe"
      }
    ],
    "runningCosts": [
      {
        "id": "177667355487661q08dgi2",
        "type": "visual mods",
        "date": "2026-02-01T09:21:11.000Z",
        "amount": 1000,
        "mileage": 289500,
        "description": "Jante Japan Racing SL01 18x8.5 ",
        "vendor": "Japan Racing"
      },
      {
        "id": "1776673427171m13b8jwq2",
        "type": "performance",
        "date": "2026-02-01T09:21:11.000Z",
        "amount": 700,
        "mileage": 289500,
        "description": "Cauciucuri Yokohama Advan Neova AD09",
        "vendor": "Yokohama"
      },
      {
        "id": "177626403727324n4tfk8n",
        "type": "performance",
        "date": "2026-02-01T15:39:12.000Z",
        "amount": 500,
        "mileage": 289000,
        "description": "Software Alex"
      },
      {
        "id": "1",
        "type": "aquisition",
        "date": "2020-01-01T00:00:00.000Z",
        "amount": 3000,
        "description": "Vehicle purchase"
      },
      {
        "id": "2",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 136,
        "description": "Distributie balance shaft + garnituri pompa servo + garnituri pompa vacuum"
      },
      {
        "id": "3",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 25,
        "description": "Butoane clima"
      },
      {
        "id": "4",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 34,
        "description": "Suruburi distributie"
      },
      {
        "id": "5",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 34,
        "description": "Vas expansiune"
      },
      {
        "id": "6",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 152,
        "description": "Distributie camshaft"
      },
      {
        "id": "7",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 22,
        "description": "Garnitura capac distributie"
      },
      {
        "id": "8",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 30,
        "description": "Garnitura capac supape"
      },
      {
        "id": "9",
        "type": "visual mods",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 136,
        "description": "Grila maptiun"
      },
      {
        "id": "10",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 30,
        "description": "Prezoane"
      },
      {
        "id": "11",
        "type": "visual mods",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 90,
        "description": "Lip aero fibra sticla"
      },
      {
        "id": "12",
        "type": "performance",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 340,
        "description": "Furtune silicon do88"
      },
      {
        "id": "13",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 700,
        "description": "Rulment presiune + ambreiaj + volant + sealuri diferential"
      },
      {
        "id": "14",
        "type": "other",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 150,
        "description": "ECU spare"
      },
      {
        "id": "15",
        "type": "other",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 80,
        "description": "(Pedala + clapeta acceleratie) spare"
      },
      {
        "id": "16",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 240,
        "description": "Rulment roata fata x2"
      },
      {
        "id": "17",
        "type": "maintenance",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 80,
        "description": "Placute frana"
      },
      {
        "id": "18",
        "type": "visual mods",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 720,
        "description": "Reconditionare interior"
      },
      {
        "id": "19",
        "type": "visual mods",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 300,
        "description": "Lip aero orig + presuri"
      },
      {
        "id": "20",
        "type": "performance",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 200,
        "description": "Intercooler + fittings"
      },
      {
        "id": "21",
        "type": "visual mods",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 1900,
        "description": "Jante Alfa Romeo 19x9 19x10"
      },
      {
        "id": "22",
        "type": "maintenance",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 700,
        "description": "Toate bucsele + bieletele"
      },
      {
        "id": "23",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 200,
        "description": "Radiator + diverse"
      },
      {
        "id": "24",
        "type": "performance",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 90,
        "description": "Filtru K&N"
      },
      {
        "id": "25",
        "type": "repair",
        "date": "2019-01-01T00:00:00.000Z",
        "amount": 520,
        "description": "turbo + conducte"
      },
      {
        "id": "26",
        "type": "performance",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 800,
        "description": "Soft 240whp Maptun + cabluri injectoare + maptuner X",
        "vendor": "Maptun"
      },
      {
        "id": "27",
        "type": "repair",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 160,
        "description": "Pistonase capac decapotare"
      },
      {
        "id": "28",
        "type": "repair",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 300,
        "description": "Distributie OEM",
        "vendor": "R&D Carparts"
      },
      {
        "id": "29",
        "type": "repair",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 42,
        "description": "Solenoid boost control"
      },
      {
        "id": "30",
        "type": "repair",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 670,
        "description": "Bobine aftermarket + bobine OEM"
      },
      {
        "id": "31",
        "type": "performance",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 300,
        "description": "Arcuri + flanse amortizor"
      },
      {
        "id": "32",
        "type": "performance",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 480,
        "description": "Ceas boost AEM + Ceas AFR AEM"
      },
      {
        "id": "33",
        "type": "performance",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 160,
        "description": "Frane 314mm (Discuri EBC + EBC Redstuff fata, ATE PowerDisc Spate + ATE Ceramic)"
      },
      {
        "id": "34",
        "type": "performance",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 280,
        "description": "Clapeta evacuare electronica"
      },
      {
        "id": "35",
        "type": "performance",
        "date": "2022-01-01T00:00:00.000Z",
        "amount": 600,
        "description": "Deflector vant pliabil + cablu tensiune stanga soft top + cover atenta"
      },
      {
        "id": "36",
        "type": "maintenance",
        "date": "2023-01-01T00:00:00.000Z",
        "amount": 340,
        "description": "Cauciucuri fata+indreptat jante fata 252k km"
      },
      {
        "id": "37",
        "type": "performance",
        "date": "2023-01-01T00:00:00.000Z",
        "amount": 30,
        "description": "Furtun boost silicon do88"
      },
      {
        "id": "38",
        "type": "performance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 540,
        "description": "Downpipe + racecat 200cel"
      },
      {
        "id": "39",
        "type": "performance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 600,
        "description": "Evacuare 76mm"
      },
      {
        "id": "40",
        "type": "performance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 140,
        "description": "Tobe finale v6"
      },
      {
        "id": "41",
        "type": "visual mods",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 100,
        "description": "Difuzor aero spate evacuare dubla"
      },
      {
        "id": "42",
        "type": "maintenance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 180,
        "description": "radiator 2.0T valeo"
      },
      {
        "id": "43",
        "type": "maintenance",
        "date": "2023-01-01T00:00:00.000Z",
        "amount": 74,
        "description": "Termostat vemo + antigel hepu p999 G12+"
      },
      {
        "id": "44",
        "type": "maintenance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 34,
        "description": "Vas expansiune NRF"
      },
      {
        "id": "45",
        "type": "performance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 140,
        "description": "Becuri LED faza scurta"
      },
      {
        "id": "46",
        "type": "performance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 740,
        "description": "Amortizoare bilstein b8"
      },
      {
        "id": "47",
        "type": "maintenance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 80,
        "description": "Flanse amortizor fata+spate"
      },
      {
        "id": "48",
        "type": "repair",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 120,
        "description": "Simeringuri cutie - furca selectoare + ulei cutie motul gear 300"
      },
      {
        "id": "49",
        "type": "repair",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 110,
        "description": "PCV+furtune vacuum"
      },
      {
        "id": "50",
        "type": "performance",
        "date": "2023-06-13T00:00:00.000Z",
        "amount": 167,
        "description": "Pompa benzina racetronix 251lph"
      },
      {
        "id": "51",
        "type": "repair",
        "date": "2024-05-14T00:00:00.000Z",
        "amount": 130,
        "description": "rebuild alternator + electromotor"
      },
      {
        "id": "52",
        "type": "repair",
        "date": "2024-06-16T00:00:00.000Z",
        "amount": 100,
        "description": "caseta directie sh"
      },
      {
        "id": "53",
        "type": "maintenance",
        "date": "2024-06-16T00:00:00.000Z",
        "amount": 320,
        "description": "brat stanga moog + flanse amortizor SKF"
      },
      {
        "id": "54",
        "type": "repair",
        "date": "2024-06-16T00:00:00.000Z",
        "amount": 540,
        "description": "caseta directie SAAB noua"
      },
      {
        "id": "55",
        "type": "maintenance",
        "date": "2024-06-16T00:00:00.000Z",
        "amount": 340,
        "description": "vopsit+indretptat jante BBS"
      },
      {
        "id": "56",
        "type": "repair",
        "date": "2024-06-16T00:00:00.000Z",
        "amount": 260,
        "description": "clapeta acceleratie pierburg"
      },
      {
        "id": "57",
        "type": "performance",
        "date": "2025-02-01T00:00:00.000Z",
        "amount": 300,
        "description": "do88 air intake"
      },
      {
        "id": "58",
        "type": "performance",
        "date": "2025-02-01T00:00:00.000Z",
        "amount": 100,
        "description": "greddy airnx s filter"
      },
      {
        "id": "59",
        "type": "performance",
        "date": "2025-02-01T00:00:00.000Z",
        "amount": 100,
        "description": "conducte frana HEL"
      },
      {
        "id": "60",
        "type": "performance",
        "date": "2025-02-01T00:00:00.000Z",
        "amount": 280,
        "description": "ceas AEM presiune ulei"
      },
      {
        "id": "62",
        "type": "maintenance",
        "date": "2025-02-01T00:00:00.000Z",
        "amount": 80,
        "description": "Garnituri termostat + pompa servo + pompa benzina"
      },
      {
        "id": "63",
        "type": "performance",
        "date": "2025-12-01T00:00:00.000Z",
        "amount": 880,
        "description": "Turbo td04hl-20T"
      },
      {
        "id": "64",
        "type": "performance",
        "date": "2025-12-01T00:00:00.000Z",
        "amount": 160,
        "description": "axe came b207R"
      },
      {
        "id": "65",
        "type": "performance",
        "date": "2025-12-01T00:00:00.000Z",
        "amount": 440,
        "description": "do88 charge pipes kit"
      }
    ],
    "purchasePrice": 3000,
    "currentMileage": 289000,
    "maintenanceHistory": [
      {
        "id": "1",
        "date": "2020-03-01T14:48:00.000Z",
        "mileage": 218000,
        "type": "scheduled",
        "description": "Timing chain + Oil",
        "cost": 208,
        "nextServiceDate": "2021-03-01T14:48:00.000Z",
        "nextServiceMileage": 228000,
        "partsReplaced": [
          {
            "name": "Balance shaft timing chain",
            "cost": 100
          },
          {
            "name": "Spark plugs",
            "cost": 72
          },
          {
            "name": "Power steering pump gaskets + vacuum pump gaskets",
            "cost": 18
          },
          {
            "name": "Cylinderhead cover gaskets",
            "cost": 18
          }
        ]
      },
      {
        "id": "2",
        "date": "2020-08-01T14:48:00.000Z",
        "mileage": 223000,
        "type": "unscheduled",
        "description": "Clutch + flywheel",
        "cost": 560,
        "nextServiceDate": "2021-03-01T14:48:00.000Z",
        "nextServiceMileage": 228000,
        "partsReplaced": [
          {
            "name": "Clutch",
            "cost": 300
          },
          {
            "name": "Volant",
            "cost": 260
          }
        ]
      },
      {
        "id": "3",
        "date": "2021-01-01T14:48:00.000Z",
        "mileage": 226000,
        "type": "scheduled",
        "description": "Oil + filters + bucse punte fata",
        "cost": 440,
        "nextServiceDate": "2022-01-01T14:48:00.000Z",
        "nextServiceMileage": 236000,
        "partsReplaced": [
          {
            "name": "Liquimoly HC7 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          },
          {
            "name": "Filtru polen(carbon activ)",
            "cost": 10
          },
          {
            "name": "Filtru aer bosch",
            "cost": 10
          },
          {
            "name": "bielete antiruliu, busce bara stabilizatoare, brate, suporti motor fata+spate",
            "cost": 350
          }
        ]
      },
      {
        "id": "4",
        "date": "2021-03-01T14:48:00.000Z",
        "mileage": 226000,
        "type": "scheduled",
        "description": "Timing chain",
        "cost": 300,
        "nextServiceDate": "2022-01-01T14:48:00.000Z",
        "nextServiceMileage": 236000,
        "partsReplaced": [
          {
            "name": "Timing chain OEM (camshaft only)",
            "cost": 300
          }
        ]
      },
      {
        "id": "5",
        "date": "2021-09-01T14:48:00.000Z",
        "mileage": 234000,
        "type": "unscheduled",
        "description": "Turbo replacement + water pump",
        "cost": 1600,
        "nextServiceDate": "2022-09-01T14:48:00.000Z",
        "nextServiceMileage": 244000,
        "partsReplaced": [
          {
            "name": "Turbo TD04-14T + oil and water pipes",
            "cost": 520
          },
          {
            "name": "Water pump HEPU",
            "cost": 70
          },
          {
            "name": "Liquimoly HC7 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          },
          {
            "name": "Arcuri eibach prokit + flanse lemforder",
            "cost": 300
          },
          {
            "name": "Rulmenti fata SKF",
            "cost": 240
          },
          {
            "name": "Bobine OEM",
            "cost": 400
          }
        ]
      },
      {
        "id": "6",
        "date": "2022-04-01T14:48:00.000Z",
        "mileage": 237000,
        "type": "scheduled",
        "description": "Ulei + filtru",
        "cost": 70,
        "nextServiceDate": "2023-04-01T14:48:00.000Z",
        "nextServiceMileage": 244000,
        "partsReplaced": [
          {
            "name": "Liquimoly New Gen 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          }
        ]
      },
      {
        "id": "7",
        "date": "2022-05-01T14:48:00.000Z",
        "mileage": 241500,
        "type": "scheduled",
        "description": "Frane (discuri + placute)",
        "cost": 700,
        "nextServiceDate": "2023-04-01T14:48:00.000Z",
        "nextServiceMileage": 244000,
        "partsReplaced": [
          {
            "name": "Frane 314mm (Discuri EBC + EBC Redstuff fata, ATE PowerDisc Spate + ATE Ceramic)",
            "cost": 700
          }
        ]
      },
      {
        "id": "8",
        "date": "2022-07-20T14:48:00.000Z",
        "mileage": 244599,
        "type": "scheduled",
        "description": "Ulei + filtru",
        "cost": 70,
        "nextServiceDate": "2023-07-20T14:48:00.000Z",
        "nextServiceMileage": 255000,
        "partsReplaced": [
          {
            "name": "Liquimoly New Gen 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          }
        ]
      },
      {
        "id": "9",
        "date": "2023-02-01T14:48:00.000Z",
        "mileage": 250000,
        "type": "scheduled",
        "description": "Bucse punte spate + brate (toate)",
        "cost": 350,
        "nextServiceDate": "2023-07-20T14:48:00.000Z",
        "nextServiceMileage": 255000,
        "partsReplaced": [
          {
            "name": "Bucse punte spate + brate",
            "cost": 350
          }
        ]
      },
      {
        "id": "10",
        "date": "2023-03-24T14:48:00.000Z",
        "mileage": 252000,
        "type": "unscheduled",
        "description": "Bujii denso ik24",
        "cost": 50,
        "nextServiceDate": "2023-07-20T14:48:00.000Z",
        "nextServiceMileage": 255000,
        "partsReplaced": [
          {
            "name": "Bujii denso ik24",
            "cost": 50
          }
        ]
      },
      {
        "id": "11",
        "date": "2023-04-30T14:48:00.000Z",
        "mileage": 254200,
        "type": "scheduled",
        "description": "Ulei + filtru",
        "cost": 70,
        "nextServiceDate": "2024-04-30T14:48:00.000Z",
        "nextServiceMileage": 265000,
        "partsReplaced": [
          {
            "name": "Liquimoly toptec4110 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          }
        ]
      },
      {
        "id": "12",
        "date": "2023-05-18T14:48:00.000Z",
        "mileage": 255000,
        "type": "upgrade",
        "description": "Furtun boost silicon",
        "cost": 30,
        "nextServiceDate": "2024-04-30T14:48:00.000Z",
        "nextServiceMileage": 265000,
        "partsReplaced": [
          {
            "name": "Furtun boost silicon aliexpress",
            "cost": 30
          }
        ]
      },
      {
        "id": "13",
        "date": "2023-06-13T14:48:00.000Z",
        "mileage": 256000,
        "type": "upgrade",
        "description": "Downpipe, racecat, finale v6",
        "cost": 1090,
        "nextServiceDate": "2024-04-30T14:48:00.000Z",
        "nextServiceMileage": 265000,
        "partsReplaced": [
          {
            "name": "Downpipe Bizon garage (racecat 200cells)",
            "cost": 550
          },
          {
            "name": "Evacuare 76mm Daniel Tox",
            "cost": 600
          },
          {
            "name": "Tobe finale v6",
            "cost": 140
          }
        ]
      },
      {
        "id": "14",
        "date": "2023-09-12T14:48:00.000Z",
        "mileage": 263357,
        "type": "scheduled",
        "description": "Ulei + filtru",
        "cost": 70,
        "nextServiceDate": "2024-09-12T14:48:00.000Z",
        "nextServiceMileage": 274000,
        "partsReplaced": [
          {
            "name": "Liquimoly toptec4110 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          }
        ]
      },
      {
        "id": "15",
        "date": "2024-02-01T14:48:00.000Z",
        "mileage": 267000,
        "type": "scheduled",
        "description": "Ulei cutie",
        "cost": 60,
        "nextServiceDate": "2024-09-12T14:48:00.000Z",
        "nextServiceMileage": 274000,
        "partsReplaced": [
          {
            "name": "Ulei cutie motul gear 300",
            "cost": 60
          }
        ]
      },
      {
        "id": "24",
        "date": "2024-05-14T14:48:00.000Z",
        "mileage": 268000,
        "type": "unscheduled",
        "description": "electromotor + alternator rebuild, indreptat jante + vopsit, valva pcv+evap delete",
        "cost": 580,
        "nextServiceDate": "2024-09-12T14:48:00.000Z",
        "nextServiceMileage": 274000,
        "partsReplaced": [
          {
            "name": "Electromotor + alternator rebuild",
            "cost": 120
          },
          {
            "name": "Indreptat jante BBS + vopsit",
            "cost": 350
          },
          {
            "name": "PCV",
            "cost": 110
          }
        ]
      },
      {
        "id": "16",
        "date": "2024-06-16T14:48:00.000Z",
        "mileage": 269000,
        "type": "scheduled",
        "description": "Ulei + filtru",
        "cost": 70,
        "nextServiceDate": "2025-06-16T14:48:00.000Z",
        "nextServiceMileage": 279000,
        "partsReplaced": [
          {
            "name": "Liquimoly toptec4110 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          }
        ]
      },
      {
        "id": "17",
        "date": "2024-06-16T14:48:00.000Z",
        "mileage": 269000,
        "type": "unscheduled",
        "description": "Caseta directie",
        "cost": 540,
        "nextServiceDate": "2025-06-16T14:48:00.000Z",
        "nextServiceMileage": 279000,
        "partsReplaced": [
          {
            "name": "Caseta directie OEM saab + bielete directie",
            "cost": 540
          }
        ]
      },
      {
        "id": "18",
        "date": "2025-02-01T14:48:00.000Z",
        "mileage": 277000,
        "type": "scheduled",
        "description": "Ulei + filtru + admisie + refacut harness + racitor ulei",
        "cost": 620,
        "nextServiceDate": "2026-02-01T14:48:00.000Z",
        "nextServiceMileage": 287000,
        "partsReplaced": [
          {
            "name": "Liquimoly toptec4110 5w-40",
            "cost": 60
          },
          {
            "name": "Filtru ulei",
            "cost": 10
          },
          {
            "name": "Admisie do88",
            "cost": 300
          },
          {
            "name": "Filtru aer greddy airnx s",
            "cost": 100
          },
          {
            "name": "Racitor ulei Nissens",
            "cost": 100
          },
          {
            "name": "Bujii denso ik24",
            "cost": 50
          }
        ]
      },
      {
        "id": "19",
        "date": "2025-08-01T14:48:00.000Z",
        "mileage": 285000,
        "type": "scheduled",
        "description": "Ulei + filtru ulei",
        "cost": 50,
        "nextServiceDate": "2026-08-01T14:48:00.000Z",
        "nextServiceMileage": 295000,
        "partsReplaced": [
          {
            "name": "Kroon oil torsynth 5w40",
            "cost": 40
          },
          {
            "name": "Filtru ulei Mann",
            "cost": 10
          }
        ]
      },
      {
        "id": "20",
        "date": "2025-09-01T14:48:00.000Z",
        "mileage": 287382,
        "type": "scheduled",
        "description": "Bujii",
        "cost": 50,
        "nextServiceDate": "2026-08-01T14:48:00.000Z",
        "nextServiceMileage": 295000,
        "partsReplaced": [
          {
            "name": "Bujii denso ik24 gap 0.8mm",
            "cost": 50
          }
        ]
      },
      {
        "id": "21",
        "date": "2025-12-01T14:48:00.000Z",
        "mileage": 289200,
        "type": "scheduled",
        "description": "Ulei + filtru ulei",
        "cost": 50,
        "nextServiceDate": "2026-12-01T14:48:00.000Z",
        "nextServiceMileage": 299000,
        "partsReplaced": [
          {
            "name": "Kroon oil torsynth 5w40",
            "cost": 40
          },
          {
            "name": "Filtru ulei Mahle",
            "cost": 10
          }
        ]
      },
      {
        "id": "22",
        "date": "2025-12-01T14:48:00.000Z",
        "mileage": 289200,
        "type": "upgrade",
        "description": "Turbo TD04HL-20T",
        "cost": 1600,
        "nextServiceDate": "2026-12-01T14:48:00.000Z",
        "nextServiceMileage": 299000,
        "partsReplaced": [
          {
            "name": "TD04HL-20T Tomczuk",
            "cost": 900
          },
          {
            "name": "Do88 charge pipes",
            "cost": 440
          },
          {
            "name": "Axe came b207R",
            "cost": 160
          },
          {
            "name": "Fulie alternator INA",
            "cost": 100
          }
        ]
      },
      {
        "id": "23",
        "date": "2026-03-01T14:48:00.000Z",
        "mileage": 289769,
        "type": "upgrade",
        "description": "Ulei + filtru ulei + cauciucuri",
        "cost": 770,
        "nextServiceDate": "2027-03-01T14:48:00.000Z",
        "nextServiceMileage": 300000,
        "partsReplaced": [
          {
            "name": "Liquimoly Molygen 5w40",
            "cost": 60
          },
          {
            "name": "Filtru ulei Mahle",
            "cost": 10
          },
          {
            "name": "yokohama advan neova ad09",
            "cost": 700
          }
        ]
      }
    ],
    "vin": "YS3FF75S556010287",
    "color": "Black",
    "transmission": "manual",
    "vignetteHistory": [
      {
        "id": "1776449097636fn4lmd76q",
        "name": "Ro-vignette",
        "country": "Romania",
        "purchaseDate": "2025-07-20T17:15:01.000Z",
        "expiryDate": "2026-07-19T17:15:01.000Z",
        "cost": 35,
        "notificationIds": [
          "355f19fd-8e7c-4cb7-b721-d940fd4c9acf",
          "c6507b75-f05a-4d96-9b78-026ff06a7478",
          "59d9619b-aba7-497d-9b72-5095b7426a14",
          "e5863252-d0ef-4f2c-aca7-9796cc10af58"
        ]
      }
    ]
  },
  {
    "id": "44b2654a-7e79-40a3-9136-96af62740c8e",
    "make": "Renault",
    "model": "Megane",
    "year": 2009,
    "licensePlate": "B16FPI",
    "fuel": "petrol",
    "engineCode": "K4M",
    "imageUrl": "file:///var/mobile/Containers/Data/Application/798420FE-C069-4A6C-970A-DEFC6D6E6059/Library/Caches/ExponentExperienceData/@anonymous/garage-flow-2ab0a36e-5935-4385-b588-d1b0240b84fd/ImagePicker/B77F237C-CF23-42DC-81B2-923AB76353E1.jpg"
  }
]

export default carList;
