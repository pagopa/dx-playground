#!/usr/bin/env python3
import sys
import pydot

def safe_id(name):
    # trasforma nomi con caratteri non alfanumerici in CamelCase-safe
    parts = [p.capitalize() for p in name.replace('"', '').replace('-', ' ').replace('.', ' ').split()]
    return ''.join(parts) or name

def main(dot_path, out_path=None):
    graphs = pydot.graph_from_dot_file(dot_path)
    if not graphs:
        print(f"Error: cannot parse {dot_path}", file=sys.stderr)
        sys.exit(1)
    g = graphs[0]
    # scegli orientamento LR di default
    print("```mermaid")
    print("graph LR")
    # subgraphs: non gestiti automaticamente, ma potresti raggruppare per prefisso se vuoi
    # per semplicità, elenchiamo prima i nodi
    nodes = {n.get_name() for n in g.get_nodes() if n.get_name() not in ('node', 'graph')}
    for n in nodes:
        label = n.strip('"')
        print(f'  {safe_id(n)}["{label}"]')
    # poi le edge
    for e in g.get_edges():
        src = safe_id(e.get_source())
        dst = safe_id(e.get_destination())
        print(f'  {src} --> {dst}')
    print("```")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: dot_to_mermaid.py <input.dot> [output.mmd]", file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1])