class Solution(object):

    def firstStableIndex(self,nums, k):
        dic = {}
        for i in range(len(nums)):
            maxf = 0
            minf = float('inf')
            t = 0
            for j in range(0,i+1):
                maxf = max(nums[j],maxf)
            for l in range(i,len(nums)):
                minf = min(minf,nums[l])
            t = maxf-minf
            if (t <= k):
                dic[i] = t

        sorted_dict = sorted(dic.items(),key = lambda x:x[0])
        return sorted_dict[0][0]
    
nums = [5,0,1,4] 
k=3
print(Solution().firstStableIndex(nums, k))
