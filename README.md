## Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE Lms;
```

Import the SQL dump:

```bash
psql -U postgres -d Lms -f sql/Leave_management_system.sql
```
