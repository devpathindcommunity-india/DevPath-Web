
import pandas as pd
import json
import os

INPUT_FILE = 'HaclFiesta-Rankings.xlsx'
OUTPUT_FILE = 'src/data/rankings.json'

import re

def safe_float(val):
    try:
        return float(val)
    except (ValueError, TypeError):
        # Try to extract first number from string
        s = str(val)
        match = re.search(r'(\d+(\.\d+)?)', s)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass
        return 0.0

def extract_rankings():
    try:
        if not os.path.exists(INPUT_FILE):
             print(f"Error: {INPUT_FILE} not found.")
             return

        # Find header row
        df_preview = pd.read_excel(INPUT_FILE, header=None, nrows=20)
        header_idx = -1
        
        for i, row in df_preview.iterrows():
            vals = [str(v).lower() for v in row.values]
            if 'rank' in vals and 'total' in vals:
                header_idx = i
                break
        
        if header_idx == -1:
            print("Could not find header row containing 'Rank' and 'Total'.")
            return

        df = pd.read_excel(INPUT_FILE, header=header_idx)
        df = df.dropna(subset=['Total'])
        
        cols = df.columns.tolist()
        col_map = {}
        
        print("--- Mapping Columns ---")
        for c in cols:
            cl = str(c).lower().strip()
            print(f"Checking: '{cl}'")
            
            if 'rank' in cl: 
                col_map['rank'] = c
                print(f"  -> Mapped RANK to '{c}'")
            
            if 'project' in cl: 
                col_map['project'] = c
                print(f"  -> Mapped PROJECT to '{c}'")
                
            if 'originality' in cl: 
                col_map['originality'] = c
                print(f"  -> Mapped ORIGINALITY to '{c}'")
                
            if 'technical' in cl: 
                col_map['technical'] = c
                print(f"  -> Mapped TECHNICAL to '{c}'")
                
            if 'ui/ux' in cl or 'design' in cl: 
                col_map['design'] = c
                print(f"  -> Mapped DESIGN to '{c}'")
                
            if 'scalability' in cl: 
                col_map['innovation'] = c
                print(f"  -> Mapped INNOVATION to '{c}'")
                
            if 'impact' in cl or 'problem' in cl: 
                col_map['presentation'] = c
                print(f"  -> Mapped PRESENTATION to '{c}'")
                
            if 'total' in cl: 
                col_map['total'] = c
                print(f"  -> Mapped TOTAL to '{c}'")
                
        print("--- Final Column Map ---")
        print(json.dumps(col_map, indent=2))
            
        rankings = []
        for i, (idx, row) in enumerate(df.iterrows()):
            try:
                rank_val = row.get(col_map.get('rank'))
                if pd.isna(rank_val): continue
                
                try:
                    rank = int(rank_val)
                except ValueError:
                    continue
                
                if i == 0:
                     print("--- Debug Row 0 ---")
                     print("Row Values:", row.to_dict())
                     print("Dtypes:", df.dtypes)
                     for key in ['originality', 'technical', 'design', 'innovation', 'presentation']:
                         col = col_map.get(key)
                         val = row.get(col)
                         print(f"Key: {key}, Val: {repr(val)}")

                item = {
                    'rank': rank,
                    'project': str(row.get(col_map.get('project'), '')).strip(),
                    'total': safe_float(row.get(col_map.get('total'), 0)),
                    'details': {
                        'originality': safe_float(row.get(col_map.get('originality'), 0)),
                        'technical': safe_float(row.get(col_map.get('technical'), 0)),
                        'design': safe_float(row.get(col_map.get('design'), 0)),
                        'innovation': safe_float(row.get(col_map.get('innovation'), 0)),
                        'presentation': safe_float(row.get(col_map.get('presentation'), 0))
                    }
                }
                rankings.append(item)
            except Exception as e:
                print(f"Error parsing row: {e}")
                continue
                
        rankings.sort(key=lambda x: x['rank'])
        top_20 = rankings[:20]
        
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(top_20, f, indent=2)
            
        print(f"Successfully extracted {len(top_20)} rankings to {OUTPUT_FILE}")
        
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    extract_rankings()
