import pandas as pd
import glob
import os
from sqlalchemy import create_engine
def merge_csv_files():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_folder = os.path.join(base_dir, "..", "data", "CSV")
    output_file = os.path.join(base_dir, "..", "data", "merged_data.csv")
    all_files = glob.glob(os.path.join(input_folder, "*.csv"))
    if not all_files:
        print("No CSV files found in the directory.")
        return
    print(f"Found {len(all_files)} CSV files. Merging...")
    df_list = []
    for file in all_files:
        try:
            df = pd.read_csv(file)
            df_list.append(df)
        except Exception as e:
            print(f"Error reading {file}: {e}")
    combined_df = pd.concat(df_list, ignore_index=True)
    shuffeled_df = combined_df.sample(frac=1, random_state=42).reset_index(drop=True)
    shuffeled_df = shuffeled_df.drop_duplicates(subset=['itemId'], keep='first')
    shuffeled_df.to_csv(output_file, index=False)
    print(f"Merged data saved to {output_file}")
    try:
        engine=create_engine("postgresql://postgres:123456@localhost:5342/RecommendSystem")
        df=pd.read_csv(output_file)
        df.to_sql("merged_data", engine, if_exists="replace", index=False)
        print("Lưu dữ liệu vào database thành công!")
    except Exception as e:
        print(f"Error loading data into database: {e}")
if __name__ == "__main__":
    merge_csv_files()