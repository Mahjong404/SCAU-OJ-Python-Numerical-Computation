#include <cstdio>

using namespace std;

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        int k;
        scanf("%d", &k);
        double forward = 0.0, backward = 0.0;
        for (int i = 1; i <= k; ++i) forward += 1.0 / i;
        for (int i = k; i >= 1; --i) backward += 1.0 / i;
        printf("%.14f %.14f\n", forward, backward);
    }
    return 0;
}
