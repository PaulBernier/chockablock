# Communication with chockagents

The server and chockagents communicate with JSON messages over websockets.

## Handshake

During the handshake the agent needs to populate a `agentname` HTTP header with a distuinguishable name.

## Messages

The envelope of the message only contains 2 fields `command` and `params`:

```json
{
    "command": "start-load" | "stop-load",
    "params": {...}
}
```

For a `start-load` command, the params field has the following form:
```json
{
    "type": "constant",
    "chainIds": ["xxx", "yyy"],
    "esAddress": "Es32PjobTxPTd73dohEFRegMFRLv3X5WZ4FXEwNN8kE2pMDfeMym",
    "entrySizeRange": [1, 1024],
    "params": {...}
}

`params` is specific to the type of load.