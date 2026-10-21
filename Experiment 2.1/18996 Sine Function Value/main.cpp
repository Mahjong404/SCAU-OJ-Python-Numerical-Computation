#include <cmath>
#include <cstdio>

int main() {
    int m;
    std::scanf("%d", &m);
    while (m--) {
        double x;
        std::scanf("%lf", &x);
        std::printf("%.14f\n", std::sin(x));
    }
    return 0;
}
