--
-- PostgreSQL database dump
--

\restrict QbGEhWa5YdaWfjIGqkFXW38sDdQWd8vzcDaiHbqBgEL4ZK39JceZFjRZZejJp3g

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Name: leave_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.leave_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.leave_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    name character varying(20),
    email character varying(30),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    leave_balance integer DEFAULT 10,
    password character varying(225),
    manager_id integer
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaves (
    id integer NOT NULL,
    emp_id integer,
    leavereason text NOT NULL,
    status public.leave_status DEFAULT 'PENDING'::public.leave_status,
    from_date date DEFAULT '2026-05-14'::date,
    to_date date DEFAULT '2026-05-16'::date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    days integer DEFAULT 3,
    email_sent boolean DEFAULT false
);


ALTER TABLE public.leaves OWNER TO postgres;

--
-- Name: leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leaves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leaves_id_seq OWNER TO postgres;

--
-- Name: leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leaves_id_seq OWNED BY public.leaves.id;


--
-- Name: months; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.months (
    month_name character varying(20),
    month_num integer
);


ALTER TABLE public.months OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(20),
    emp_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    emp_id integer,
    session_id uuid NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO postgres;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: leaves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves ALTER COLUMN id SET DEFAULT nextval('public.leaves_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.employees VALUES (26, 'abc', 'abc@yopmail.com', '2026-05-21 13:16:41.722592', '2026-05-21 13:16:41.722592', 10, NULL, 37);
INSERT INTO public.employees VALUES (24, 'qdf', 'qdf@yopmail.com', '2026-05-20 15:14:55.899145', '2026-05-20 15:14:55.899145', 9, NULL, NULL);
INSERT INTO public.employees VALUES (55, 'gyn', 'gyn@yopmail.com', '2026-05-29 16:26:19.177494', '2026-05-29 16:26:19.177494', 9, '$2b$10$QjTf1ygfWo0YxewJnwXrceMUY/SDVyujNln/I0K9THdiwDn9WgI0i', 37);
INSERT INTO public.employees VALUES (25, 'xyz', 'xyz@yopmail.com', '2026-05-21 13:16:19.013098', '2026-05-21 13:16:19.013098', 9, NULL, 24);
INSERT INTO public.employees VALUES (28, 'qaz', 'qaz@yopmail.com', '2026-05-21 16:27:02.031756', '2026-05-21 16:27:02.031756', 10, NULL, 24);
INSERT INTO public.employees VALUES (31, 'dfgh', 'dfgh@yopmail.com', '2026-05-21 19:11:54.369531', '2026-05-21 19:11:54.369531', 9, NULL, 24);
INSERT INTO public.employees VALUES (38, 'rty', 'rty@yopmail.com', '2026-05-27 20:02:41.467529', '2026-05-27 20:02:41.467529', 10, '$2b$10$xjB3yndajteOBcETBLytueNADdhBlfNuRlE.j.LC2OwYHVr/eh9K2', 24);
INSERT INTO public.employees VALUES (42, 'rew', 'rew@yopmail.com', '2026-05-29 11:25:27.12263', '2026-05-29 11:25:27.12263', 10, '$2b$10$iO4Fdx.tHx/.mKQAbYxNlOr3bJmcCN57iWnhJEO6ihHbdcwFiEdk6', 24);
INSERT INTO public.employees VALUES (48, 'tyu2', 'tyu2@yopmail.com', '2026-05-29 12:19:27.234293', '2026-05-29 12:19:27.234293', 10, '$2b$10$RtAtHyS/uvXAvOTKHNyo6ObfJ2XZo/seOUFe18Ir5cUVVq/rFSIbW', 24);
INSERT INTO public.employees VALUES (34, 'wer', 'wer@yopmail.com', '2026-05-27 16:33:34.112599', '2026-05-27 16:33:34.112599', 10, NULL, 22);
INSERT INTO public.employees VALUES (39, 'rwy', 'rwy@yopmail.com', '2026-05-27 20:15:44.322983', '2026-05-27 20:15:44.322983', 10, '$2b$10$9OIGbK3tS1YTMZsOm8WwveckJxvdBvP4fxLXUdQClr4lIIgkfc9wy', 22);
INSERT INTO public.employees VALUES (43, 'rew1', 'rew1@yopmail.com', '2026-05-29 11:30:03.385214', '2026-05-29 11:30:03.385214', 10, '$2b$10$0HHRATEh4j5hmSou9q3fceSv/LwQhg42U/LAUhzV4aBLXq.2REyY6', 22);
INSERT INTO public.employees VALUES (45, 'tyu', 'tyu@yopmail.com', '2026-05-29 11:44:10.951521', '2026-05-29 11:44:10.951521', 10, '$2b$10$ooseSPjfbZVmMz92BpsYWumSJVwGPz.y6mNDQgyVr8lIONATbC4v.', 41);
INSERT INTO public.employees VALUES (49, 'hcv', 'hcv@yopmail.com', '2026-05-29 15:26:33.76768', '2026-05-29 15:26:33.76768', 10, '$2b$10$os2bUQzQ/TjP6p1FpzPEeOt2Qu9ljNzQGwwaZ49FyI7rVIpCgiEfO', 41);
INSERT INTO public.employees VALUES (54, 'bhe', 'bhe@yopmail.com', '2026-05-29 16:21:12.690895', '2026-05-29 16:21:12.690895', 10, '$2b$10$vNP2Z6EcAyu6BW07OU4cD.xv5/dk0X8oKt67/FQ2KhiQOyQnkPxla', 41);
INSERT INTO public.employees VALUES (22, 'sdf', 'sdf@yopmail.com', '2026-05-20 15:12:33.666241', '2026-05-20 15:12:33.666241', 8, NULL, 24);
INSERT INTO public.employees VALUES (37, 'axcv', 'axcv@yopmail.com', '2026-05-27 19:58:32.657069', '2026-05-27 19:58:32.657069', 10, '$2b$10$VmQk0y1VirpzgmtXPCu6AelC6dhmzLk5opd2mQja/Z7HEWDF2a2Ym', 24);
INSERT INTO public.employees VALUES (41, 'gyj', 'gyj@yopmail.com', '2026-05-29 11:23:59.460377', '2026-05-29 11:23:59.460377', 10, '$2b$10$BWiPxZRqFib.vjoa1GGvb.NZqYxTrDHVNwe9euPf5BoMnRR5UotBa', 24);
INSERT INTO public.employees VALUES (40, 'hsd', 'hsd@yopmail.com', '2026-05-27 20:30:39.3012', '2026-05-27 20:30:39.3012', 6, '$2b$10$ZZRXGCeZ9nqryz/HhrFyeuJhlbHZQm8BdDE1MG/k1JVHq4WFvMPQO', 37);
INSERT INTO public.employees VALUES (44, 'xcv', 'xcv@yopmail.com', '2026-05-29 11:34:35.488005', '2026-05-29 11:34:35.488005', 8, '$2b$10$QltLhJpYtXQ34JsXuhihdeaKebfUT/OWZdDJ.EDae5ElqgrNYmBda', 41);
INSERT INTO public.employees VALUES (46, 'tyu1', 'tyu1@yopmail.com', '2026-05-29 11:54:45.759204', '2026-05-29 11:54:45.759204', 8, '$2b$10$CQXjE0QyTai0F1fsE58jAuvtjZF8vO1M9oiTjSV.Iu8SoHR3y6mZ6', 37);


--
-- Data for Name: knex_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.knex_migrations VALUES (1, '1_employeesTable.js', 1, '2026-05-08 19:36:36.077+05:30');
INSERT INTO public.knex_migrations VALUES (2, '2_leavesTable.js', 1, '2026-05-08 19:36:36.086+05:30');


--
-- Data for Name: knex_migrations_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.knex_migrations_lock VALUES (1, 0);


--
-- Data for Name: leaves; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.leaves VALUES (27, 25, 'Emergency leave', 'PENDING', '2026-05-23', '2026-05-25', '2026-05-21 19:05:17.127899', '2026-05-21 19:05:17.127899', 3, false);
INSERT INTO public.leaves VALUES (23, 24, 'Casual leave', 'APPROVED', '2026-05-25', '2026-05-26', '2026-05-20 17:13:27.378376', '2026-05-20 17:13:27.378376', 2, false);
INSERT INTO public.leaves VALUES (30, 25, 'Sick Leave', 'APPROVED', '2026-05-23', '2026-05-23', '2026-05-22 18:47:21.584466', '2026-05-22 18:47:21.584466', 1, false);
INSERT INTO public.leaves VALUES (32, 31, 'Sick Leave', 'APPROVED', '2026-05-27', '2026-05-27', '2026-05-26 12:39:57.059644', '2026-05-26 12:39:57.059644', 1, false);
INSERT INTO public.leaves VALUES (29, 22, 'Casual leave', 'PENDING', '2026-05-23', '2026-05-25', '2026-05-21 19:06:21.95562', '2026-05-21 19:06:21.95562', 3, false);
INSERT INTO public.leaves VALUES (33, 24, 'Sick Leave', 'PENDING', '2026-05-25', '2026-05-25', '2026-05-27 17:14:22.322921', '2026-05-27 17:14:22.322921', 1, false);
INSERT INTO public.leaves VALUES (24, 22, 'Casual Leave', 'PENDING', '2026-06-01', '2026-06-02', '2026-05-21 15:09:49.543517', '2026-05-21 15:09:49.543517', 2, false);
INSERT INTO public.leaves VALUES (37, 24, 'Sick Leave', 'PENDING', '2026-06-30', '2026-06-30', '2026-06-01 16:36:41.360858', '2026-06-01 16:36:41.360858', 1, false);
INSERT INTO public.leaves VALUES (38, 55, 'Sick Leave', 'APPROVED', '2026-06-30', '2026-06-30', '2026-06-01 16:56:35.58778', '2026-06-01 16:56:35.58778', 1, false);
INSERT INTO public.leaves VALUES (44, 49, 'Sick Leave', 'PENDING', '2026-06-02', '2026-06-02', '2026-06-01 19:13:17.070654', '2026-06-01 19:13:17.070654', 1, false);
INSERT INTO public.leaves VALUES (41, 45, 'Casual leave', 'PENDING', '2026-06-30', '2026-06-30', '2026-06-01 19:11:07.475032', '2026-06-01 19:11:07.475032', 1, false);
INSERT INTO public.leaves VALUES (43, 44, 'Sick Leave', 'APPROVED', '2026-06-02', '2026-06-02', '2026-06-01 19:12:50.544131', '2026-06-01 19:12:50.544131', 1, false);
INSERT INTO public.leaves VALUES (45, 49, 'Sick Leave', 'REJECTED', '2026-06-02', '2026-06-05', '2026-06-01 19:38:20.854109', '2026-06-01 19:38:20.854109', 1, false);
INSERT INTO public.leaves VALUES (42, 54, 'Casual leave', 'REJECTED', '2026-06-23', '2026-06-23', '2026-06-01 19:11:33.639168', '2026-06-01 19:11:33.639168', 1, false);
INSERT INTO public.leaves VALUES (48, 55, 'Emergency Leave', 'REJECTED', '2026-06-03', '2026-06-03', '2026-06-02 14:56:29.075297', '2026-06-02 14:56:29.075297', 1, false);
INSERT INTO public.leaves VALUES (46, 46, 'Sick Leave', 'APPROVED', '2026-06-03', '2026-06-03', '2026-06-02 14:55:40.31403', '2026-06-02 14:55:40.31403', 1, false);
INSERT INTO public.leaves VALUES (47, 40, 'Casual Leave', 'APPROVED', '2026-06-03', '2026-06-03', '2026-06-02 14:55:58.277991', '2026-06-02 14:55:58.277991', 1, false);
INSERT INTO public.leaves VALUES (75, 55, 'Emergency Leave', 'REJECTED', '2026-06-04', '2026-06-04', '2026-06-04 17:27:00.145436', '2026-06-04 17:27:00.145436', 1, true);
INSERT INTO public.leaves VALUES (53, 40, 'Emergency Leave', 'APPROVED', '2026-06-03', '2026-06-03', '2026-06-03 13:30:31.962332', '2026-06-03 13:30:31.962332', 1, true);
INSERT INTO public.leaves VALUES (51, 44, 'Emergency Leave', 'APPROVED', '2026-06-03', '2026-06-03', '2026-06-03 13:13:20.573619', '2026-06-03 13:13:20.573619', 1, true);
INSERT INTO public.leaves VALUES (49, 46, 'Emergency Leave', 'APPROVED', '2026-06-03', '2026-06-03', '2026-06-03 13:12:39.089722', '2026-06-03 13:12:39.089722', 1, false);


--
-- Data for Name: months; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.months VALUES ('January', 1);
INSERT INTO public.months VALUES ('February', 2);
INSERT INTO public.months VALUES ('March', 3);
INSERT INTO public.months VALUES ('April', 4);
INSERT INTO public.months VALUES ('May', 5);
INSERT INTO public.months VALUES ('June', 6);
INSERT INTO public.months VALUES ('July', 7);
INSERT INTO public.months VALUES ('August', 8);
INSERT INTO public.months VALUES ('September', 9);
INSERT INTO public.months VALUES ('October', 10);
INSERT INTO public.months VALUES ('November', 11);
INSERT INTO public.months VALUES ('December', 12);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles VALUES (21, 'QA', 22, '2026-05-20 16:39:57.695072', '2026-05-20 16:39:57.695072');
INSERT INTO public.roles VALUES (23, 'DEV', 25, '2026-05-22 13:10:54.181582', '2026-05-22 13:10:54.181582');
INSERT INTO public.roles VALUES (26, 'DEV', 31, '2026-05-22 13:13:11.96994', '2026-05-22 13:13:11.96994');
INSERT INTO public.roles VALUES (27, 'DEV', 28, '2026-05-22 13:16:17.710553', '2026-05-22 13:16:17.710553');
INSERT INTO public.roles VALUES (31, 'Admin', 22, '2026-05-27 20:28:34.093672', '2026-05-27 20:28:34.093672');
INSERT INTO public.roles VALUES (32, 'QA', 39, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (33, 'QA', 34, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (34, 'UI', 46, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (35, 'UI', 40, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (36, 'HR', 37, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (37, 'HR', 55, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (38, 'DEV', 38, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (39, 'DEV', 48, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (40, 'DEV', 42, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (41, 'PM', 41, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (42, 'DA', 54, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (43, 'DA', 44, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (44, 'BA', 49, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (45, 'BA', 45, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (46, 'QA', 43, '2026-06-01 17:41:43.252343', '2026-06-01 17:41:43.252343');
INSERT INTO public.roles VALUES (29, 'DEV', 24, '2026-05-25 12:08:17.595874', '2026-05-25 12:08:17.595874');
INSERT INTO public.roles VALUES (22, 'MANAGER', 24, '2026-05-20 16:39:57.695072', '2026-05-20 16:39:57.695072');
INSERT INTO public.roles VALUES (28, 'QA', 24, '2026-05-22 19:32:52.708254', '2026-05-22 19:32:52.708254');
INSERT INTO public.roles VALUES (24, 'UI', 26, '2026-05-22 13:11:21.252201', '2026-05-22 13:11:21.252201');


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sessions VALUES (39, 49, 'ca62e96d-7a0e-4da2-9ac1-1c9f26178ab4', true, '2026-06-01 16:16:41.327636');
INSERT INTO public.sessions VALUES (40, 37, '7fd83623-2a96-4283-8d64-bd1f68df5db9', true, '2026-06-01 18:57:52.073044');
INSERT INTO public.sessions VALUES (41, 37, 'c45a351b-7690-4b4e-93db-f67e2c162305', true, '2026-06-01 19:04:29.864518');
INSERT INTO public.sessions VALUES (42, 41, '091a85bf-f3fc-4b2e-b8c0-75ba00e8b398', true, '2026-06-01 19:44:19.518915');
INSERT INTO public.sessions VALUES (43, 41, 'a3a812a6-1a0a-4e20-8c37-3a03467c30d1', true, '2026-06-02 13:03:06.580094');
INSERT INTO public.sessions VALUES (44, 41, '5c2f4da9-3ce8-449b-bf69-4a100023f75a', true, '2026-06-02 13:12:45.8552');
INSERT INTO public.sessions VALUES (45, 37, '821fd11d-536f-4521-befd-f49c20cd0b8d', true, '2026-06-02 14:57:20.430567');
INSERT INTO public.sessions VALUES (46, 37, '81a45ace-aaad-4570-947b-9e4099ad65d0', true, '2026-06-03 12:38:33.460876');
INSERT INTO public.sessions VALUES (47, 37, '20222ded-c384-4478-85c7-0f1ebab53c35', true, '2026-06-03 13:13:53.170544');
INSERT INTO public.sessions VALUES (48, 37, 'b9b64166-c3e8-475b-8c1f-b8506044a687', true, '2026-06-03 13:25:21.430862');
INSERT INTO public.sessions VALUES (49, 37, '9b6ba674-b65c-49f2-81fd-23314fc349fd', true, '2026-06-03 13:30:40.896617');
INSERT INTO public.sessions VALUES (50, 41, '4269e70f-9ef3-4760-9250-a7e34cb11e97', true, '2026-06-03 13:42:24.771353');
INSERT INTO public.sessions VALUES (51, 37, 'f19dc654-3d04-49b6-8034-d1c0f47a2931', true, '2026-06-03 19:47:24.655033');
INSERT INTO public.sessions VALUES (52, 37, '1ad715bf-a741-4f37-9177-e9820f152d6b', true, '2026-06-04 11:44:23.034451');
INSERT INTO public.sessions VALUES (53, 37, '3d9bc4b4-f864-4bbc-9316-088d3391ea93', true, '2026-06-04 11:53:58.948071');
INSERT INTO public.sessions VALUES (54, 37, '925c3f8f-b233-4cab-ac61-b462558c2ec7', true, '2026-06-04 13:12:12.117166');
INSERT INTO public.sessions VALUES (55, 37, '0c32d6e0-9b5f-4817-97c0-cc03f735d1de', true, '2026-06-04 13:24:28.519601');
INSERT INTO public.sessions VALUES (56, 37, '7222c599-0b0a-4df2-9660-d3361269584c', true, '2026-06-04 13:28:28.737263');
INSERT INTO public.sessions VALUES (57, 37, '525ac2d7-c6cc-42b3-83af-564fb736b64b', true, '2026-06-04 15:56:27.314871');
INSERT INTO public.sessions VALUES (58, 37, '54bc6527-230d-4358-ae98-6c4ba3c898ba', true, '2026-06-04 16:03:53.510774');
INSERT INTO public.sessions VALUES (59, 37, '7e60cd42-ef8c-4481-973b-baf903ac3ff9', true, '2026-06-04 16:11:44.369103');
INSERT INTO public.sessions VALUES (60, 37, '29f4f819-0372-4f27-a5dd-513d16374d7d', true, '2026-06-04 16:19:05.609899');
INSERT INTO public.sessions VALUES (61, 37, '39ca18f9-90d0-4a35-b29c-d328fdd915e9', true, '2026-06-04 16:27:18.851718');
INSERT INTO public.sessions VALUES (62, 37, 'e41f7b23-3a5f-411d-ad83-51b1277f49f0', true, '2026-06-04 16:39:56.541789');
INSERT INTO public.sessions VALUES (63, 37, '9bae7f18-6479-4f33-87a4-48f9b3947e93', true, '2026-06-04 16:49:31.184977');
INSERT INTO public.sessions VALUES (64, 37, '0d15499b-fd54-409b-a836-9c8aebe7dc1e', true, '2026-06-04 16:52:09.46703');
INSERT INTO public.sessions VALUES (65, 37, '5ef0fef9-32c2-49f0-ad03-85990ae0cde6', true, '2026-06-04 16:54:25.332666');
INSERT INTO public.sessions VALUES (66, 37, '9eabbe88-2d37-44ae-9e61-4e1b602f3099', true, '2026-06-04 16:57:38.657134');
INSERT INTO public.sessions VALUES (67, 37, '108c9511-e4fe-4ed0-acde-105279f4e489', true, '2026-06-04 17:02:01.904847');
INSERT INTO public.sessions VALUES (68, 37, '7bfe85a1-385c-49b5-bb85-c6f5775d5669', true, '2026-06-04 17:25:15.994691');
INSERT INTO public.sessions VALUES (69, 37, '8e0817f5-f8e0-40a3-9dc5-8005a2c67db3', true, '2026-06-04 17:27:06.003752');
INSERT INTO public.sessions VALUES (70, 37, 'a889f13e-8ca0-4703-a393-0c73be238923', true, '2026-06-04 19:32:10.017754');
INSERT INTO public.sessions VALUES (71, 37, '935f1125-2ce0-406d-8260-6c45f6a05a4b', true, '2026-06-05 11:37:58.806076');


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 55, true);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_id_seq', 2, true);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.knex_migrations_lock_index_seq', 1, true);


--
-- Name: leaves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leaves_id_seq', 75, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 46, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_id_seq', 71, true);


--
-- Name: employees employees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_email_key UNIQUE (email);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: leaves leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: idx_leave_emp_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_emp_status ON public.leaves USING btree (emp_id, status);


--
-- Name: idx_leave_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_status ON public.leaves USING btree (status);


--
-- Name: roles fk_emp_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT fk_emp_id FOREIGN KEY (emp_id) REFERENCES public.employees(id);


--
-- Name: sessions fk_emp_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_emp_id FOREIGN KEY (emp_id) REFERENCES public.employees(id);


--
-- Name: leaves fk_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT fk_id FOREIGN KEY (emp_id) REFERENCES public.employees(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict QbGEhWa5YdaWfjIGqkFXW38sDdQWd8vzcDaiHbqBgEL4ZK39JceZFjRZZejJp3g

