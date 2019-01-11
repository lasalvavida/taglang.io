#include <algorithm>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <map>
#include <unordered_map>

std::string randomString(size_t length){
	auto randomChar = []() -> char
	{
		const char charset[] =
			"0123456789"
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			"abcdefghijklmnopqrstuvwxyz";
		const size_t maxIndex = (sizeof(charset) - 1);
		return charset[rand() % maxIndex];
	};
	std::string str(length, 0);
	std::generate_n(str.begin(), length, randomChar);
	return str;
}

int main(){
	std::vector<std::string> keys;
	std::map<std::string, bool> orderedMap;
	std::unordered_map<std::string, bool> unorderedMap;

	int numKeys = 11;
	int keyLength = 32;

	for (int i = 0; i < numKeys; i++) {
		std::string key = randomString(keyLength);
		keys.push_back(key);
		orderedMap[key] = true;
		unorderedMap[key] = true;
	}

	std::clock_t startOrdered, endOrdered, startUnordered, endUnordered;
	startOrdered = std::clock();
	for (int i = 0; i < 100000; i++) {
		bool lookup = orderedMap[keys[rand() % numKeys]];
	}
	endOrdered = std::clock();

	startUnordered = std::clock();
	for (int i = 0; i < 100000; i++) {
		bool lookup = unorderedMap[keys[rand() % numKeys]];
	}
	endUnordered = std::clock();

	std::cout << "Ordered Search Time: " << (endOrdered - startOrdered) / (double)(CLOCKS_PER_SEC / 1000) << " ms" << std::endl;
	std::cout << "Unordered Search Time: " << (endUnordered - startUnordered) / (double)(CLOCKS_PER_SEC / 1000) << " ms" << std::endl;

    return 0;
}
