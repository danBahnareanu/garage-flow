import { Car } from "../features/cars/types/car.types";

let carList: Car[] = [
    {
        id: "1",
        make: "Bmw",
        model: "330ci",
        year: 2002,
        licensePlate: "ABC1234",
        fuel: "petrol",
        engineCode: "M54B30",
        imageUrl: "",

    },
    {
        id: "4",
        make: "Saab",
        model: "9-3 Convertible",
        year: 2005,
        licensePlate: "B134DVX",
        fuel: "petrol",
        engineCode: "B207L",
        imageUrl: "https://cdn-fastly.autoguide.com/media/2025/06/15/03552/2008-saab-9-3-for-sale.jpg?size=720x845&nocrop=1",

        // Insurance history
        insuranceHistory: [{
            id: "2",
            provider: "Axeria",
            policyNumber: "54110211176",
            startDate: "2025-12-21T14:48:00.000Z",
            expiryDate: "2026-12-20T14:48:00.000Z",
            cost: 264,
            coverageType: "RCA"
        },
        {
            id: "1",
            provider: "Grawe",
            policyNumber: "54110211176",
            startDate: "2024-12-19T14:48:00.000Z",
            expiryDate: "2025-12-18T14:48:00.000Z",
            cost: 350,
            coverageType: "RCA"
        }],

        // Inspection history
        inspectionHistory: [{
            id: "1",
            type: "ITP",
            date: "2024-12-05T14:48:00.000Z",
            expiryDate: "2025-12-05T14:48:00.000Z",
            result: "pass",
            mileage: 274000,
            cost: 50
        },
        {
            id: "2",
            type: "ITP",
            date: "2025-12-05T14:48:00.000Z",
            expiryDate: "2026-12-05T14:48:00.000Z",
            result: "pass",
            mileage: 285000,
            cost: 50,
            notes: "Gainarie required pentru noxe"
        }],

        // Running costs
        runningCosts: [
            {
                id: "1",
                type: "aquisition",
                date: "2020-01-01T00:00:00.000Z",
                amount: 3000,
                description: "Vehicle purchase"
            },
            {
                id: "2",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 136,
                description: "Distributie balance shaft + garnituri pompa servo + garnituri pompa vacuum"
            },
            {
                id: "3",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 25,
                description: "Butoane clima"
            },
            {
                id: "4",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 34,
                description: "Suruburi distributie"
            },
            {
                id: "5",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 34,
                description: "Vas expansiune"
            },
            {
                id: "6",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 152,
                description: "Distributie camshaft"
            },
            {
                id: "7",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 22,
                description: "Garnitura capac distributie"
            },
            {
                id: "8",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 30,
                description: "Garnitura capac supape"
            },
            {
                id: "9",
                type: "visual mods",
                date: "2019-01-01T00:00:00.000Z",
                amount: 136,
                description: "Grila maptiun"
            },
            {
                id: "10",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 30,
                description: "Prezoane"
            },
            {
                id: "11",
                type: "visual mods",
                date: "2019-01-01T00:00:00.000Z",
                amount: 90,
                description: "Lip aero fibra sticla"
            },
            {
                id: "12",
                type: "performance",
                date: "2019-01-01T00:00:00.000Z",
                amount: 340,
                description: "Furtune silicon do88"
            },{
                id: "13",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 700,
                description: "Rulment presiune + ambreiaj + volant + sealuri diferential"
            },
            {
                id: "14",
                type: "other",
                date: "2019-01-01T00:00:00.000Z",
                amount: 150,
                description: "ECU spare"
            },
            {
                id: "15",
                type: "other",
                date: "2019-01-01T00:00:00.000Z",
                amount: 80,
                description: "(Pedala + clapeta acceleratie) spare"
            },
            {
                id: "16",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 240,
                description: "Rulment roata fata x2"
            },
            {
                id: "17",
                type: "maintenance",
                date: "2019-01-01T00:00:00.000Z",
                amount: 80,
                description: "Placute frana"
            },
            {
                id: "18",
                type: "visual mods",
                date: "2019-01-01T00:00:00.000Z",
                amount: 720,
                description: "Reconditionare interior"
            },
            {
                id: "19",
                type: "visual mods",
                date: "2019-01-01T00:00:00.000Z",
                amount: 300,
                description: "Lip aero orig + presuri"
            },
            {
                id: "20",
                type: "performance",
                date: "2019-01-01T00:00:00.000Z",
                amount: 200,
                description: "Intercooler + fittings"
            },
            {
                id: "21",
                type: "visual mods",
                date: "2019-01-01T00:00:00.000Z",
                amount: 1900,
                description: "Jante Alfa Romeo 19x9 19x10"
            },
            {
                id: "22",
                type: "maintenance",
                date: "2019-01-01T00:00:00.000Z",
                amount: 700,
                description: "Toate bucsele + bieletele"
            },
            {
                id: "23",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 200,
                description: "Radiator + diverse"
            },
            {
                id: "24",
                type: "performance",
                date: "2019-01-01T00:00:00.000Z",
                amount: 90,
                description: "Filtru K&N"
            },
            {
                id: "25",
                type: "repair",
                date: "2019-01-01T00:00:00.000Z",
                amount: 520,
                description: "turbo + conducte"
            },
            {
                id: "26",
                type: "performance",
                date: "2022-01-01T00:00:00.000Z",
                amount: 800,
                description: "Soft 240whp Maptun + cabluri injectoare + maptuner X",
                vendor: "Maptun"
            },
            {
                id: "27",
                type: "repair",
                date: "2022-01-01T00:00:00.000Z",
                amount: 160,
                description: "Pistonase capac decapotare"
            },
            {
                id: "28",
                type: "repair",
                date: "2022-01-01T00:00:00.000Z",
                amount: 300,
                description: "Distributie OEM",
                vendor: "R&D Carparts"
            },
            {
                id: "29",
                type: "repair",
                date: "2022-01-01T00:00:00.000Z",
                amount: 42,
                description: "Solenoid boost control"
            },
            {
                id: "30",
                type: "repair",
                date: "2022-01-01T00:00:00.000Z",
                amount: 670,
                description: "Bobine aftermarket + bobine OEM"
            },
            {
                id: "31",
                type: "performance",
                date: "2022-01-01T00:00:00.000Z",
                amount: 300,
                description: "Arcuri + flanse amortizor"
            },
            {
                id: "32",
                type: "performance",
                date: "2022-01-01T00:00:00.000Z",
                amount: 480,
                description: "Ceas boost AEM + Ceas AFR AEM"
            },
            {
                id: "33",
                type: "performance",
                date: "2022-01-01T00:00:00.000Z",
                amount: 160,
                description: "Frane 314mm (Discuri EBC + EBC Redstuff fata, ATE PowerDisc Spate + ATE Ceramic)"
            },
            {
                id: "34",
                type: "performance",
                date: "2022-01-01T00:00:00.000Z",
                amount: 280,
                description: "Clapeta evacuare electronica"
            },
            {
                id: "35",
                type: "performance",
                date: "2022-01-01T00:00:00.000Z",
                amount: 600,
                description: "Deflector vant pliabil + cablu tensiune stanga soft top + cover atenta"
            },
            {
                id: "36",
                type: "maintenance",
                date: "2023-01-01T00:00:00.000Z",
                amount: 340,
                description: "Cauciucuri fata+indreptat jante fata 252k km"
            },
            {
                id: "37",
                type: "performance",
                date: "2023-01-01T00:00:00.000Z",
                amount: 30,
                description: "Furtun boost silicon do88"
            },
            {
                id: "38",
                type: "performance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 540,
                description: "Downpipe + racecat 200cel"
            },
            {
                id: "39",
                type: "performance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 600,
                description: "Evacuare 76mm"
            },
            {
                id: "40",
                type: "performance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 140,
                description: "Tobe finale v6"
            },
            {
                id: "41",
                type: "visual mods",
                date: "2023-06-13T00:00:00.000Z",
                amount: 100,
                description: "Difuzor aero spate evacuare dubla"
            },
            {
                id: "42",
                type: "maintenance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 180,
                description: "radiator 2.0T valeo"
            },
            {
                id: "43",
                type: "maintenance",
                date: "2023-01-01T00:00:00.000Z",
                amount: 74,
                description: "Termostat vemo + antigel hepu p999 G12+"
            },
            {
                id: "44",
                type: "maintenance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 34,
                description: "Vas expansiune NRF"
            },
            {
                id: "45",
                type: "performance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 140,
                description: "Becuri LED faza scurta"
            },
            {
                id: "46",
                type: "performance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 740,
                description: "Amortizoare bilstein b8"
            },
            {
                id: "47",
                type: "maintenance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 80,
                description: "Flanse amortizor fata+spate"
            },
            {
                id: "48",
                type: "repair",
                date: "2023-06-13T00:00:00.000Z",
                amount: 120,
                description: "Simeringuri cutie - furca selectoare + ulei cutie motul gear 300"
            },
            {
                id: "49",
                type: "repair",
                date: "2023-06-13T00:00:00.000Z",
                amount: 110,
                description: "PCV+furtune vacuum"
            },
            {
                id: "50",
                type: "performance",
                date: "2023-06-13T00:00:00.000Z",
                amount: 167,
                description: "Pompa benzina racetronix 251lph"
            },
            {
                id: "51",
                type: "repair",
                date: "2024-05-14T00:00:00.000Z",
                amount: 130,
                description: "rebuild alternator + electromotor"
            },
            {
                id: "52",
                type: "repair",
                date: "2024-06-16T00:00:00.000Z",
                amount: 100,
                description: "caseta directie sh"
            },
            {
                id: "53",
                type: "maintenance",
                date: "2024-06-16T00:00:00.000Z",
                amount: 320,
                description: "brat stanga moog + flanse amortizor SKF"
            },
            {
                id: "54",
                type: "repair",
                date: "2024-06-16T00:00:00.000Z",
                amount: 540,
                description: "caseta directie SAAB noua"
            },
            {
                id: "55",
                type: "maintenance",
                date: "2024-06-16T00:00:00.000Z",
                amount: 340,
                description: "vopsit+indretptat jante BBS"
            },
            {
                id: "56",
                type: "repair",
                date: "2024-06-16T00:00:00.000Z",
                amount: 260,
                description: "clapeta acceleratie pierburg"
            },
            {
                id: "57",
                type: "performance",
                date: "2025-02-01T00:00:00.000Z",
                amount: 300,
                description: "do88 air intake"
            },
            {
                id: "58",
                type: "performance",
                date: "2025-02-01T00:00:00.000Z",
                amount: 100,
                description: "greddy airnx s filter"
            },
            {
                id: "59",
                type: "performance",
                date: "2025-02-01T00:00:00.000Z",
                amount: 100,
                description: "conducte frana HEL"
            },
            {
                id: "60",
                type: "performance",
                date: "2025-02-01T00:00:00.000Z",
                amount: 280,
                description: "ceas AEM presiune ulei"
            },
            {
                id: "62",
                type: "maintenance",
                date: "2025-02-01T00:00:00.000Z",
                amount: 80,
                description: "Garnituri termostat + pompa servo + pompa benzina"
            },
            {
                id: "63",
                type: "performance",
                date: "2025-12-01T00:00:00.000Z",
                amount: 880,
                description: "Turbo td04hl-20T"
            },
            {
                id: "64",
                type: "performance",
                date: "2025-12-01T00:00:00.000Z",
                amount: 160,
                description: "axe came b207R"
            },
            {
                id: "65",
                type: "performance",
                date: "2025-12-01T00:00:00.000Z",
                amount: 440,
                description: "do88 charge pipes kit"
            }
        ],
        purchasePrice: 3000,

        // Maintenance tracking
        currentMileage: 289000,
        maintenanceHistory: [
            {
                id: "1",
                date: "2025-08-20T14:48:00.000Z",
                mileage: 285000,
                type: "scheduled",
                description: "ulei kroon oil torsynth 5w40 + filtru ulei mann",
                cost: 450,
                nextServiceDate: "2026-08-20T14:48:00.000Z",
                nextServiceMileage: 295000
            },
            {
                id: "2",
                date: "2025-09-20T14:48:00.000Z",
                mileage: 287382,
                type: "scheduled",
                description: "Bujii denso ik24 gap 0.8mm",
                cost: 450
            }
        ],

        // Additional details
        vin: "YS3FF75S556010287",
        color: "Black",
        transmission: 'manual'
    }
]

export default carList;
