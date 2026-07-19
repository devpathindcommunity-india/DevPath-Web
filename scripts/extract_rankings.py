
import pandas as pd
import json
import os

INPUT_FILE = 'HaclFiesta-Rankings.xlsx'
OUTPUT_FILE = 'src/data/rankings.json'

def safe_float(val):
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0

def extract_rankings():
    try:
        if not os.path.exists(INPUT_FILE):
             print(f"Error: {INPUT_FILE} not found.")
             return

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
        for c in cols:
            cl = str(c).lower()
            print(f"Scanning col: '{cl}'")
            if 'rank' in cl: col_map['rank'] = c
            elif 'project' in cl: col_map['project'] = c
            elif 'originality' in cl: col_map['originality'] = c
            elif 'technical' in cl: col_map['technical'] = c
            elif 'ui/ux' in cl: col_map['design'] = c
            elif 'scalability' in cl: col_map['innovation'] = c
            elif 'problem' in cl: col_map['presentation'] = c
            elif 'total' in cl: col_map['total'] = c
            
        print("DEBUG: Column Map:", col_map)

        rankings = []
        for i, (idx, row) in enumerate(df.iterrows()):
            try:
                if i == 0:
                    print("DEBUG: Row 1 Raw Values:")
                    print(f"Originality Col: {col_map.get('originality')} -> {row.get(col_map.get('originality'))}")
                    print(f"Total Col: {col_map.get('total')} -> {row.get(col_map.get('total'))}")

                rank_val = row[col_map['rank']]
                if pd.isna(rank_val): continue
                
                # Check if Rank is numeric, if not skip (it might be a comment row)
                try:
                    rank = int(rank_val)
                except ValueError:
                    continue
                
                item = {
                    'rank': rank,
                    'project': str(row[col_map['project']]).strip(),
                    'total': safe_float(row[col_map['total']]),
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
                # print(f"Skipping row due to error: {e}")
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
