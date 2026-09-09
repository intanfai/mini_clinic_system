--
-- PostgreSQL database dump
--

\restrict makUu0T5y8ujDc4jwnKzduWysUeZo2LhiLec9RHQWRx5LTJTqYVaD8QkCCDL1Lm

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Patients_jenis_kelamin; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Patients_jenis_kelamin" AS ENUM (
    'L',
    'P'
);


ALTER TYPE public."enum_Patients_jenis_kelamin" OWNER TO postgres;

--
-- Name: enum_Queues_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Queues_status" AS ENUM (
    'menunggu',
    'dipanggil',
    'selesai'
);


ALTER TYPE public."enum_Queues_status" OWNER TO postgres;

--
-- Name: enum_Registrations_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Registrations_status" AS ENUM (
    'menunggu',
    'checkin',
    'pemeriksaan',
    'selesai'
);


ALTER TYPE public."enum_Registrations_status" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'administrator',
    'dokter',
    'petugas_pendaftaran'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Doctors" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    poli_id integer NOT NULL,
    nama_dokter character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Doctors" OWNER TO postgres;

--
-- Name: Doctors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Doctors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Doctors_id_seq" OWNER TO postgres;

--
-- Name: Doctors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Doctors_id_seq" OWNED BY public."Doctors".id;


--
-- Name: MedicalRecords; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MedicalRecords" (
    id integer NOT NULL,
    registration_id integer NOT NULL,
    keluhan text,
    tekanan_darah character varying(255),
    suhu_tubuh double precision,
    berat_badan double precision,
    tinggi_badan double precision,
    diagnosa text,
    rencana_terapi text,
    tindakan_medis text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."MedicalRecords" OWNER TO postgres;

--
-- Name: MedicalRecords_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MedicalRecords_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MedicalRecords_id_seq" OWNER TO postgres;

--
-- Name: MedicalRecords_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MedicalRecords_id_seq" OWNED BY public."MedicalRecords".id;


--
-- Name: Patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patients" (
    id integer NOT NULL,
    no_rm character varying(255) NOT NULL,
    nik character varying(255) NOT NULL,
    nama character varying(255) NOT NULL,
    jenis_kelamin public."enum_Patients_jenis_kelamin" NOT NULL,
    tanggal_lahir date NOT NULL,
    no_telp character varying(255),
    alamat text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Patients" OWNER TO postgres;

--
-- Name: Patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Patients_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Patients_id_seq" OWNER TO postgres;

--
-- Name: Patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Patients_id_seq" OWNED BY public."Patients".id;


--
-- Name: Polis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Polis" (
    id integer NOT NULL,
    nama_poli character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Polis" OWNER TO postgres;

--
-- Name: Polis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Polis_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Polis_id_seq" OWNER TO postgres;

--
-- Name: Polis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Polis_id_seq" OWNED BY public."Polis".id;


--
-- Name: Prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Prescriptions" (
    id integer NOT NULL,
    medical_record_id integer NOT NULL,
    nama_obat character varying(255) NOT NULL,
    dosis character varying(255),
    jumlah integer,
    aturan_pakai character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Prescriptions" OWNER TO postgres;

--
-- Name: Prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Prescriptions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Prescriptions_id_seq" OWNER TO postgres;

--
-- Name: Prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Prescriptions_id_seq" OWNED BY public."Prescriptions".id;


--
-- Name: Queues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Queues" (
    id integer NOT NULL,
    registration_id integer NOT NULL,
    nomor_antrean character varying(255) NOT NULL,
    status public."enum_Queues_status" DEFAULT 'menunggu'::public."enum_Queues_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Queues" OWNER TO postgres;

--
-- Name: Queues_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Queues_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Queues_id_seq" OWNER TO postgres;

--
-- Name: Queues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Queues_id_seq" OWNED BY public."Queues".id;


--
-- Name: Registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Registrations" (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    poli_id integer NOT NULL,
    tanggal_kunjungan date NOT NULL,
    jenis_pembayaran character varying(255) NOT NULL,
    keluhan_awal text,
    status public."enum_Registrations_status" DEFAULT 'menunggu'::public."enum_Registrations_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Registrations" OWNER TO postgres;

--
-- Name: Registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Registrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Registrations_id_seq" OWNER TO postgres;

--
-- Name: Registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Registrations_id_seq" OWNED BY public."Registrations".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public."enum_Users_role" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Doctors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors" ALTER COLUMN id SET DEFAULT nextval('public."Doctors_id_seq"'::regclass);


--
-- Name: MedicalRecords id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicalRecords" ALTER COLUMN id SET DEFAULT nextval('public."MedicalRecords_id_seq"'::regclass);


--
-- Name: Patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients" ALTER COLUMN id SET DEFAULT nextval('public."Patients_id_seq"'::regclass);


--
-- Name: Polis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Polis" ALTER COLUMN id SET DEFAULT nextval('public."Polis_id_seq"'::regclass);


--
-- Name: Prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions" ALTER COLUMN id SET DEFAULT nextval('public."Prescriptions_id_seq"'::regclass);


--
-- Name: Queues id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Queues" ALTER COLUMN id SET DEFAULT nextval('public."Queues_id_seq"'::regclass);


--
-- Name: Registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Registrations" ALTER COLUMN id SET DEFAULT nextval('public."Registrations_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Doctors" (id, user_id, poli_id, nama_dokter, "createdAt", "updatedAt") FROM stdin;
3	7	3	Dr. Andi	2026-09-09 01:17:17.952+07	2026-09-09 01:17:17.952+07
4	8	4	Dr. Siti	2026-09-09 01:17:17.952+07	2026-09-09 01:17:17.952+07
\.


--
-- Data for Name: MedicalRecords; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MedicalRecords" (id, registration_id, keluhan, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, diagnosa, rencana_terapi, tindakan_medis, "createdAt", "updatedAt") FROM stdin;
1	1	Demam dan sakit kepala	120/80	38.5	60	165	Demam	Istirahat dan minum obat	Pemeriksaan umum	2026-09-09 02:18:35.648+07	2026-09-09 02:18:35.648+07
2	5	Ngilu gigi geraham	120/80	NaN	60	165	sakit gigi	-	Pemeriksaan Umum	2026-09-10 04:04:34.915+07	2026-09-10 04:04:34.915+07
3	7	Ngilu	120/80	NaN	60	165	Sakit Gigi	-	Pemeriksaan	2026-09-10 04:11:01.369+07	2026-09-10 04:11:01.369+07
\.


--
-- Data for Name: Patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patients" (id, no_rm, nik, nama, jenis_kelamin, tanggal_lahir, no_telp, alamat, "createdAt", "updatedAt") FROM stdin;
1	RM-20260908-0001	3374012345678903	Budi Santoso	L	1995-05-20	\N	Semarang	2026-09-09 01:34:17.678+07	2026-09-09 01:34:17.678+07
4	RM-20260909-0001	3374000000000001	Rina Sentasa	P	2014-02-12	082456653946	Semarang	2026-09-10 03:58:55.938+07	2026-09-10 03:58:55.938+07
5	RM-20260909-0002	3374000000000005	Rina L	P	2026-09-02	05548533112	semarang	2026-09-10 04:08:41.069+07	2026-09-10 04:08:41.069+07
\.


--
-- Data for Name: Polis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Polis" (id, nama_poli, "createdAt", "updatedAt") FROM stdin;
3	Poli Umum	2026-09-09 01:17:17.949+07	2026-09-09 01:17:17.949+07
4	Poli Gigi	2026-09-09 01:17:17.949+07	2026-09-09 01:17:17.949+07
\.


--
-- Data for Name: Prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Prescriptions" (id, medical_record_id, nama_obat, dosis, jumlah, aturan_pakai, "createdAt", "updatedAt") FROM stdin;
1	1	Paracetamol	500 mg	10	3 kali sehari setelah makan	2026-09-09 02:23:29.582+07	2026-09-09 02:23:29.582+07
2	1	Paracetamol	500 mg	10	3 kali sehari setelah makan	2026-09-09 02:23:35.863+07	2026-09-09 02:23:35.863+07
3	1	Paracetamol	500 mg	10	3 kali sehari setelah makan	2026-09-10 02:26:25.6+07	2026-09-10 02:26:25.6+07
4	1	Paracetamol	500 	10	3x sehari	2026-09-10 02:37:39.466+07	2026-09-10 02:37:39.466+07
5	1	Paracetamol	500 	10	3x sehari	2026-09-10 04:11:27.337+07	2026-09-10 04:11:27.337+07
\.


--
-- Data for Name: Queues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Queues" (id, registration_id, nomor_antrean, status, "createdAt", "updatedAt") FROM stdin;
1	1	001	selesai	2026-09-09 02:08:07.238+07	2026-09-09 02:10:06.52+07
4	3	003	dipanggil	2026-09-10 02:07:46.413+07	2026-09-10 02:07:50.188+07
3	4	001	selesai	2026-09-10 01:59:14.332+07	2026-09-10 02:07:52.721+07
5	5	001	menunggu	2026-09-10 02:17:22.795+07	2026-09-10 02:17:22.795+07
2	2	002	selesai	2026-09-09 12:45:21.993+07	2026-09-10 03:31:32.843+07
6	6	001	selesai	2026-09-10 04:00:01.902+07	2026-09-10 04:00:15.374+07
7	7	002	selesai	2026-09-10 04:09:23.552+07	2026-09-10 04:09:30.651+07
\.


--
-- Data for Name: Registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Registrations" (id, patient_id, doctor_id, poli_id, tanggal_kunjungan, jenis_pembayaran, keluhan_awal, status, "createdAt", "updatedAt") FROM stdin;
2	1	3	3	2026-09-09	Umum	Demam dan sakit kepala	menunggu	2026-09-09 02:02:53.049+07	2026-09-09 02:02:53.049+07
3	1	3	3	2026-09-09	Umum	Demam dan sakit kepala	menunggu	2026-09-09 02:02:58.336+07	2026-09-09 02:02:58.336+07
1	1	3	3	2026-09-09	Umum	\N	checkin	2026-09-09 01:52:48.491+07	2026-09-09 02:03:52.698+07
4	1	3	3	2026-09-11	Umum	pusing	menunggu	2026-09-09 12:26:46.385+07	2026-09-09 12:34:56.143+07
5	1	4	4	2026-09-26	Umum	sakit gigi	menunggu	2026-09-10 02:16:49.119+07	2026-09-10 02:16:49.119+07
6	4	4	4	2026-09-11	Umum	ngilu di gigi geraham	menunggu	2026-09-10 03:59:42.409+07	2026-09-10 03:59:42.409+07
7	5	4	4	2026-09-11	Umum		menunggu	2026-09-10 04:09:07.742+07	2026-09-10 04:09:07.742+07
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260908131055-create-users.js
20260908132135-create-polis.js
20260908132219-create-patients.js
20260908132259-create-doctors.js
20260908132410-create-registrations.js
20260908132447-create-queues.js
20260908132531-create-medical-records.js
20260908132605-create-prescriptions.js
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
6	Admin Klinik	admin@klinik.com	$2b$10$/yk7D3qZnO0KlAbLofOYwOZaGnGw9bUkykUJQUyUQoDy/U67hm3MO	administrator	2026-09-09 01:17:17.941+07	2026-09-09 01:17:17.941+07
7	Dr. Andi	andi@klinik.com	$2b$10$/yk7D3qZnO0KlAbLofOYwOZaGnGw9bUkykUJQUyUQoDy/U67hm3MO	dokter	2026-09-09 01:17:17.941+07	2026-09-09 01:17:17.941+07
8	Dr. Siti	siti@klinik.com	$2b$10$/yk7D3qZnO0KlAbLofOYwOZaGnGw9bUkykUJQUyUQoDy/U67hm3MO	dokter	2026-09-09 01:17:17.941+07	2026-09-09 01:17:17.941+07
9	Petugas Pendaftaran	petugas@klinik.com	$2b$10$/yk7D3qZnO0KlAbLofOYwOZaGnGw9bUkykUJQUyUQoDy/U67hm3MO	petugas_pendaftaran	2026-09-09 01:17:17.941+07	2026-09-09 01:17:17.941+07
\.


--
-- Name: Doctors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Doctors_id_seq"', 4, true);


--
-- Name: MedicalRecords_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MedicalRecords_id_seq"', 3, true);


--
-- Name: Patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Patients_id_seq"', 5, true);


--
-- Name: Polis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Polis_id_seq"', 4, true);


--
-- Name: Prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Prescriptions_id_seq"', 5, true);


--
-- Name: Queues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Queues_id_seq"', 7, true);


--
-- Name: Registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Registrations_id_seq"', 7, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 9, true);


--
-- Name: Doctors Doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_pkey" PRIMARY KEY (id);


--
-- Name: MedicalRecords MedicalRecords_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicalRecords"
    ADD CONSTRAINT "MedicalRecords_pkey" PRIMARY KEY (id);


--
-- Name: MedicalRecords MedicalRecords_registration_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicalRecords"
    ADD CONSTRAINT "MedicalRecords_registration_id_key" UNIQUE (registration_id);


--
-- Name: Patients Patients_nik_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_nik_key" UNIQUE (nik);


--
-- Name: Patients Patients_no_rm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_no_rm_key" UNIQUE (no_rm);


--
-- Name: Patients Patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patients"
    ADD CONSTRAINT "Patients_pkey" PRIMARY KEY (id);


--
-- Name: Polis Polis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Polis"
    ADD CONSTRAINT "Polis_pkey" PRIMARY KEY (id);


--
-- Name: Prescriptions Prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions"
    ADD CONSTRAINT "Prescriptions_pkey" PRIMARY KEY (id);


--
-- Name: Queues Queues_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Queues"
    ADD CONSTRAINT "Queues_pkey" PRIMARY KEY (id);


--
-- Name: Queues Queues_registration_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Queues"
    ADD CONSTRAINT "Queues_registration_id_key" UNIQUE (registration_id);


--
-- Name: Registrations Registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Registrations"
    ADD CONSTRAINT "Registrations_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Doctors Doctors_poli_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_poli_id_fkey" FOREIGN KEY (poli_id) REFERENCES public."Polis"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Doctors Doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Doctors"
    ADD CONSTRAINT "Doctors_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MedicalRecords MedicalRecords_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicalRecords"
    ADD CONSTRAINT "MedicalRecords_registration_id_fkey" FOREIGN KEY (registration_id) REFERENCES public."Registrations"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Prescriptions Prescriptions_medical_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescriptions"
    ADD CONSTRAINT "Prescriptions_medical_record_id_fkey" FOREIGN KEY (medical_record_id) REFERENCES public."MedicalRecords"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Queues Queues_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Queues"
    ADD CONSTRAINT "Queues_registration_id_fkey" FOREIGN KEY (registration_id) REFERENCES public."Registrations"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Registrations Registrations_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Registrations"
    ADD CONSTRAINT "Registrations_doctor_id_fkey" FOREIGN KEY (doctor_id) REFERENCES public."Doctors"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Registrations Registrations_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Registrations"
    ADD CONSTRAINT "Registrations_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public."Patients"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Registrations Registrations_poli_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Registrations"
    ADD CONSTRAINT "Registrations_poli_id_fkey" FOREIGN KEY (poli_id) REFERENCES public."Polis"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict makUu0T5y8ujDc4jwnKzduWysUeZo2LhiLec9RHQWRx5LTJTqYVaD8QkCCDL1Lm

