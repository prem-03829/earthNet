import csv

# City coordinates (approximate)
city_coords = {
    'Ahmedabad': (23.0225, 72.5714),
    'Aizawl': (23.7271, 92.7176),
    'Amaravati': (16.5062, 80.6480),
    'Amritsar': (31.6340, 74.8723),
    'Bengaluru': (12.9716, 77.5946),
    'Bhopal': (23.2599, 77.4126),
    'Brajrajnagar': (21.8361, 83.9200),  # Approximate for Brajrajnagar
    'Chandigarh': (30.7333, 76.7794),
    'Chennai': (13.0827, 80.2707),
    'Coimbatore': (11.0168, 76.9558),
    'Delhi': (28.6139, 77.2090),
    'Ernakulam': (9.9816, 76.2999),
    'Gurugram': (28.4595, 77.0266),
    'Guwahati': (26.1445, 91.7362),
    'Hyderabad': (17.3850, 78.4867),
    'Jaipur': (26.9124, 75.7873),
    'Jorapokhar': (23.7000, 86.4167),  # Approximate
    'Kochi': (9.9312, 76.2673),
    'Kolkata': (22.5726, 88.3639),
    'Lucknow': (26.8467, 80.9462),
    'Mumbai': (19.0760, 72.8777),
    'Patna': (25.5941, 85.1376),
    'Shillong': (25.5788, 91.8933),
    'Talcher': (20.9500, 85.2167),  # Approximate
    'Thiruvananthapuram': (8.5241, 76.9366),
    'Visakhapatnam': (17.6868, 83.2185)
}

# Read the original CSV and get latest AQI per city
from collections import defaultdict
data = defaultdict(list)
with open('air_poll_data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        city = row['City']
        try:
            aqi = float(row['AQI'])
            data[city].append(aqi)
        except:
            pass

latest_aqi = {city: aqis[-1] for city, aqis in data.items() if aqis and city in city_coords}

# Write to new CSV
with open('../../../frontend/public/air_poll_data.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['latitude', 'longitude', 'aqi', 'city'])
    for city, aqi in latest_aqi.items():
        lat, lng = city_coords[city]
        writer.writerow([lat, lng, aqi, city])

print("Updated air_poll_data.csv in frontend/public/")