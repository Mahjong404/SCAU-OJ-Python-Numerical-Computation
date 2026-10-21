#include <cstdio>

int main() {
    int m;
    std::scanf("%d", &m);
    while (m--) {
        int k;
        std::scanf("%d", &k);
        double forward = 0.0, backward = 0.0;
        for (int i = 1; i <= k; ++i) forward += 1.0 / i;
        for (int i = k; i >= 1; --i) backward += 1.0 / i;
        std::printf("%.14f %.14f\n", forward, backward);
    }
    return 0;
}
