# best version of code

# import sys
# import json
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.chrome.options import Options
# import time
# from selenium.webdriver.chrome.service import Service as ChromeService
# from webdriver_manager.chrome import ChromeDriverManager

# def scrape_google(keyword, stop_url="www.iflair.com", num_results=100):
#     options = Options()
#     options.add_argument("--headless")
#     options.add_argument("--disable-gpu")
#     options.add_argument("--start-maximized")
#     options.add_argument("--window-size=1920,1080")
#     driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

#     driver.get("https://www.google.com")

#     search_box = driver.find_element(By.NAME, "q")
#     search_box.send_keys(keyword)
#     search_box.send_keys(Keys.RETURN)

#     current_index = 1

#     while current_index <= num_results:
#         time.sleep(2)
#         search_results = driver.find_elements(By.CSS_SELECTOR, "div.tF2Cxc")

#         for result in search_results:
#             try:
#                 title = result.find_element(By.TAG_NAME, "h3").text
#                 link = result.find_element(By.TAG_NAME, "a").get_attribute("href")

#                 if stop_url in link:
#                     driver.quit()
#                     return [{"Keyword": keyword, "Title": title, "Link": link, "Position": current_index}]

#                 current_index += 1
#             except Exception as e:
#                 continue

#         try:
#             next_button = driver.find_element(By.LINK_TEXT, "Next")
#             next_button.click()
#         except:
#             break

#     driver.quit()
#     return [{"Keyword": keyword, "Title": "N/A", "Link": "N/A", "Position": "N/A"}]

# if __name__ == "__main__":
#     keywords = json.loads(sys.argv[1])
#     all_results = []

#     for keyword in keywords:
#         results = scrape_google(keyword)
#         all_results.extend(results)

#     print(json.dumps(all_results))




# check also title keyword

import sys
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
import time
from webdriver_manager.chrome import ChromeDriverManager

def scrape_google(keyword, stop_text="iflair", stop_url="www.iflair.com", num_results=100):
    options = Options()
    options.add_argument("--headless")  # Run browser in headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--start-maximized")
    options.add_argument("--window-size=1920,1080")
    driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

    driver.get("https://www.google.com")

    # Search for the keyword
    search_box = driver.find_element(By.NAME, "q")
    search_box.send_keys(keyword)
    search_box.send_keys(Keys.RETURN)

    current_index = 1

    while current_index <= num_results:
        time.sleep(2)  # Wait for search results to load
        search_results = driver.find_elements(By.CSS_SELECTOR, "div.tF2Cxc")

        for result in search_results:
            try:
                # Extract title and link
                title = result.find_element(By.TAG_NAME, "h3").text
                link_element = result.find_element(By.TAG_NAME, "a")
                link = link_element.get_attribute("href")
                link_text = link_element.text

                # 1. Check title for stop text
                if stop_text.lower() in title.lower():
                    driver.quit()
                    return {
                        "success": True,
                        "results": [{
                            "Keyword": keyword,
                            "Title": title,
                            "Link": link,
                            "Position": current_index
                        }]
                    }

                # 2. Check URL for stop_url
                if stop_url.lower() in link.lower():
                    driver.quit()
                    return {
                        "success": True,
                        "results": [{
                            "Keyword": keyword,
                            "Title": title,
                            "Link": link,
                            "Position": current_index
                        }]
                    }

                # 3. Check link text for stop_text
                if stop_text.lower() in link_text.lower():
                    driver.quit()
                    return {
                        "success": True,
                        "results": [{
                            "Keyword": keyword,
                            "Title": title,
                            "Link": link,
                            "Position": current_index
                        }]
                    }

                current_index += 1
            except Exception as e:
                print(f"Error processing result: {e}")
                continue

        # Go to the next page if available
        try:
            next_button = driver.find_element(By.LINK_TEXT, "Next")
            next_button.click()
        except:
            break

    driver.quit()
    return {
        "success": False,
        "results": [{
            "Keyword": keyword,
            "Title": "N/A",
            "Link": "N/A",
            "Position": "N/A"
        }]
    }

if __name__ == "__main__":
    keywords = json.loads(sys.argv[1])
    all_results = []

    for keyword in keywords:
        results = scrape_google(keyword)
        all_results.append(results)

    print(json.dumps(all_results, indent=4))









# check proxy also 
# import sys
# import json
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.chrome.service import Service as ChromeService
# from selenium.webdriver.chrome.options import Options
# import time
# from webdriver_manager.chrome import ChromeDriverManager
# import os


# def scrape_google(keyword, stop_text="iflair", stop_url="www.iflair.com", num_results=100):
#     # Proxy setup from environment variables
#     proxy = os.environ.get("HTTP_PROXY")
    
#     options = Options()
#     options.add_argument("--headless")  # Run browser in headless mode
#     options.add_argument("--disable-gpu")
#     options.add_argument("--start-maximized")
#     options.add_argument("--window-size=1920,1080")
    
#     # Add proxy configuration if provided
#     if proxy:
#         options.add_argument(f"--proxy-server={proxy}")

#     driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

#     try:
#         driver.get("https://www.google.com")

#         # Search for the keyword
#         search_box = driver.find_element(By.NAME, "q")
#         search_box.send_keys(keyword)
#         search_box.send_keys(Keys.RETURN)

#         current_index = 1

#         while current_index <= num_results:
#             time.sleep(2)  # Wait for search results to load
#             search_results = driver.find_elements(By.CSS_SELECTOR, "div.tF2Cxc")

#             for result in search_results:
#                 try:
#                     # Extract title and link
#                     title = result.find_element(By.TAG_NAME, "h3").text
#                     link_element = result.find_element(By.TAG_NAME, "a")
#                     link = link_element.get_attribute("href")
#                     link_text = link_element.text

#                     # 1. Check title for stop text
#                     if stop_text.lower() in title.lower():
#                         driver.quit()
#                         return {
#                             "success": True,
#                             "results": [{
#                                 "Keyword": keyword,
#                                 "Title": title,
#                                 "Link": link,
#                                 "Position": current_index
#                             }]
#                         }

#                     # 2. Check URL for stop_url
#                     if stop_url.lower() in link.lower():
#                         driver.quit()
#                         return {
#                             "success": True,
#                             "results": [{
#                                 "Keyword": keyword,
#                                 "Title": title,
#                                 "Link": link,
#                                 "Position": current_index
#                             }]
#                         }

#                     # 3. Check link text for stop_text
#                     if stop_text.lower() in link_text.lower():
#                         driver.quit()
#                         return {
#                             "success": True,
#                             "results": [{
#                                 "Keyword": keyword,
#                                 "Title": title,
#                                 "Link": link,
#                                 "Position": current_index
#                             }]
#                         }

#                     current_index += 1
#                 except Exception as e:
#                     print(f"Error processing result: {e}")
#                     continue

#             # Go to the next page if available
#             try:
#                 next_button = driver.find_element(By.LINK_TEXT, "Next")
#                 next_button.click()
#             except:
#                 break

#         return {
#             "success": False,
#             "results": [{
#                 "Keyword": keyword,
#                 "Title": "N/A",
#                 "Link": "N/A",
#                 "Position": "N/A"
#             }]
#         }
#     finally:
#         driver.quit()


# if __name__ == "__main__":
#     keywords = json.loads(sys.argv[1])
#     all_results = []

#     for keyword in keywords:
#         results = scrape_google(keyword)
#         all_results.append(results)

#     print(json.dumps(all_results, indent=4))















# import sys
# import json
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.keys import Keys
# from selenium.webdriver.chrome.options import Options
# import time
# from selenium.webdriver.chrome.service import Service as ChromeService
# from webdriver_manager.chrome import ChromeDriverManager

# def scrape_google(keyword, stop_url="www.iflair.com", num_results=100):
#     options = Options()
#     options.add_argument("--headless")
#     options.add_argument("--disable-gpu")
#     options.add_argument("--start-maximized")
#     options.add_argument("--window-size=1920,1080")
#     driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

#     driver.get("https://www.google.com")

#     search_box = driver.find_element(By.NAME, "q")
#     search_box.send_keys(keyword)
#     search_box.send_keys(Keys.RETURN)

#     current_index = 1

#     while current_index <= num_results:
#         time.sleep(2)
#         search_results = driver.find_elements(By.CSS_SELECTOR, "div.tF2Cxc")

#         for result in search_results:
#             try:
#                 title = result.find_element(By.TAG_NAME, "h3").text
#                 link = result.find_element(By.TAG_NAME, "a").get_attribute("href")

#                 if stop_url in link:
#                     driver.quit()
#                     return [{"Keyword": keyword, "Title": title, "Link": link, "Position": current_index}]

#                 current_index += 1
#             except Exception as e:
#                 continue

#         try:
#             next_button = driver.find_element(By.LINK_TEXT, "Next")
#             next_button.click()
#         except:
#             break

#     driver.quit()
#     return [{"Keyword": keyword, "Title": "N/A", "Link": "N/A", "Position": "N/A"}]

# if __name__ == "__main__":
#     keywords = json.loads(sys.argv[1])
#     all_results = []

#     for keyword in keywords:
#         results = scrape_google(keyword)
#         all_results.extend(results)

#     print(json.dumps(all_results))
