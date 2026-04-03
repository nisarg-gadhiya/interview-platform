import Problem from '../models/coding/problem.model.js'

export const seedCodingProblems = async () => {
    try {
        const existingProblems = await Problem.countDocuments()
        if (existingProblems > 0) {
            console.log(`✓ Coding problems already seeded (${existingProblems} problems found)`)
            return
        }

        console.log("🌱 Seeding coding problems...")
        const problems = [
            {
                title: "Two Sum",
                description: "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
                difficulty: "easy",
                constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
                inputFormat: "First line: n (length of array)\nSecond line: n space-separated integers (the array)\nThird line: target integer",
                outputFormat: "Return two indices as space-separated integers",
                sampleInput: "4\n2 7 11 15\n9",
                sampleOutput: "0 1",
                category: "arrays",
                testCases: [
                    {
                        input: "4\n2 7 11 15\n9",
                        output: "0 1",
                        isHidden: false
                    },
                    {
                        input: "3\n3 2 4\n6",
                        output: "1 2",
                        isHidden: false
                    },
                    {
                        input: "2\n3 3\n6",
                        output: "0 1",
                        isHidden: true
                    },
                    {
                        input: "5\n1 2 3 4 5\n9",
                        output: "3 4",
                        isHidden: true
                    }
                ]
            },
            {
                title: "Longest Substring Without Repeating Characters",
                description: "Given a string s, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous sequence of characters within a string.",
                difficulty: "medium",
                constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
                inputFormat: "A single line containing the string s",
                outputFormat: "Return the length of the longest substring without repeating characters",
                sampleInput: "abcabcbb",
                sampleOutput: "3",
                category: "strings",
                testCases: [
                    {
                        input: "abcabcbb",
                        output: "3",
                        isHidden: false
                    },
                    {
                        input: "bbbbb",
                        output: "1",
                        isHidden: false
                    },
                    {
                        input: "pwwkew",
                        output: "3",
                        isHidden: false
                    },
                    {
                        input: "au",
                        output: "2",
                        isHidden: true
                    },
                    {
                        input: "dvdf",
                        output: "3",
                        isHidden: true
                    }
                ]
            },
            {
                title: "Median of Two Sorted Arrays",
                description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
                difficulty: "hard",
                constraints: "nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-10^6 <= nums1[i], nums2[i] <= 10^6",
                inputFormat: "First line: m n (sizes of two arrays)\nSecond line: m space-separated integers (nums1)\nThird line: n space-separated integers (nums2)",
                outputFormat: "Return the median as a decimal number",
                sampleInput: "2 2\n1 3\n2",
                sampleOutput: "2.00000",
                category: "arrays",
                testCases: [
                    {
                        input: "2 2\n1 3\n2",
                        output: "2.00000",
                        isHidden: false
                    },
                    {
                        input: "1 2\n3\n1 2",
                        output: "2.00000",
                        isHidden: false
                    },
                    {
                        input: "0 1\n\n1",
                        output: "1.00000",
                        isHidden: true
                    },
                    {
                        input: "3 3\n1 3 8\n7 9 10",
                        output: "7.50000",
                        isHidden: true
                    }
                ]
            }
        ]

        await Problem.insertMany(problems)
        console.log("✓ DSA Problems seeded successfully")
    } catch (error) {
        console.log("Error seeding problems:", error.message)
    }
}
