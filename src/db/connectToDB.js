const { createClient } = require("@supabase/supabase-js");


const connectToDB = () => {
    return createClient('https://jzrhuhjnisedgmwskrzm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cmh1aGpuaXNlZGdtd3NrcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2OTY2OTcsImV4cCI6MjAzNDI3MjY5N30.l9-yrQAWkxylkcp3AIU-DULCsrKtDiB0g854OGErDmA')
};

module.exports = connectToDB;