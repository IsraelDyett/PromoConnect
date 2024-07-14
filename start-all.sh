#!/bin/bash
concurrently "cd backend && node index.js" "cd client && npm start"
