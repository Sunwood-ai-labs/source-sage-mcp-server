#!/usr/bin/env node
import { SourceSageServer } from './server/source-sage-server.js';

const server = new SourceSageServer();
server.run().catch(console.error);
